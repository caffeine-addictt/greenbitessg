/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 *
 * Food recognition API from https://huggingface.co/nateraw/food
 * Nutrition Info from https://docx.syndigo.com/developers/docs/instant-endpoint
 */

import axios from 'axios';
import type { ZodIssue } from 'zod';

import type { IAuthedRouteHandler } from '../../route-map';
import { type errors, schemas } from '../../lib/api-types';
import { Http4XX } from '../../lib/api-types/http-codes';
import type {
  FoodGenerateSuccessAPI,
  FoodGenerateFailAPI,
} from '../../lib/api-types/food';

import { db } from '../../db';
import { and, eq } from 'drizzle-orm';
import { contentTable, foodTable } from '../../db/schemas';

// Constants
const RECOG_API_URL =
  'https://api-inference.huggingface.co/models/nateraw/food' as const;
const NUTRITION_API_URL =
  'https://trackapi.nutritionix.com/v2/search/instant' as const;

type FoodRecognitionData = { label: string; score: number }[];
type NutritionInfo = {
  food_name: string;
  serving_unit: string;
  tag_name: string;
  serving_qty: number;
  nf_calories: number;
};
interface NutritionInfoResponse {
  common: object; // Ignore this one
  branded: NutritionInfo[];
}

// Handlers
export const postGenerate: IAuthedRouteHandler = async (req, res) => {
  const validated = schemas.food.foodGenerateFormSchema.safeParse(req.body);
  if (!validated.success) {
    const errorStack: errors.CustomErrorContext[] = [];
    validated.error.errors.forEach((error: ZodIssue) => {
      errorStack.push({
        message: error.message,
        context: {
          property: error.path,
          code: error.code,
        },
      });
    });

    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: errorStack,
    } satisfies FoodGenerateFailAPI);
  }

  // Check image is from hosting service
  if (!validated.data.image.startsWith('https://utfs.io/f/')) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Image is invalid!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  // Check image key exists in db
  const key = validated.data.image.split('f/').pop();
  if (!key) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Image is invalid!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  const foundImage = await db
    .selectDistinct({})
    .from(contentTable)
    .where(
      and(
        eq(contentTable.type, 'image'),
        eq(contentTable.userId, req.user.id),
        eq(contentTable.filename, key),
      ),
    );
  if (foundImage.length === 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Image is invalid!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  // Check image is accessible
  const checkImage = await axios
    .get(validated.data.image)
    .catch((err) =>
      console.log(`Could not access image at ${validated.data.image}`, err),
    );
  if (!checkImage) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Could not access image',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  // Intepret food image
  const identifiedfood = await axios
    .post(
      RECOG_API_URL,
      { image: validated.data.image },
      {
        headers: {
          Authorization: `Bearer ${process.env.RECOGNITION_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      },
    )
    .then((res) => res.data as FoodRecognitionData)
    .catch((err) =>
      console.log(`Could not intepret image at ${validated.data.image}`, err),
    );
  if (!identifiedfood) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Could not identify food from image!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  if (identifiedfood.length === 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Could not identify food from image!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  console.log(`Analyze image at ${validated.data.image}: `, identifiedfood);

  // Get nutrition info
  const nutritionInfo = await axios
    .get(`${NUTRITION_API_URL}?query=${identifiedfood[0].label}`, {
      headers: {
        'Content-Type': 'application/json',
        'x-app-id': process.env.NUTRITION_API_ID,
        'x-app-key': process.env.NUTRITION_API_KEY,
        'x-remote-user-id':
          process.env.NODE_ENV === 'production' ? req.user.id : 0,
      },
    })
    .then((res) => (res.data as NutritionInfoResponse).branded)
    .catch((err) =>
      console.log(
        `Could not get nutrition info for ${identifiedfood[0].label}`,
        err,
      ),
    );
  if (!nutritionInfo) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Could not get nutrition info!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  if (nutritionInfo.length === 0) {
    return res.status(Http4XX.BAD_REQUEST).json({
      status: Http4XX.BAD_REQUEST,
      errors: [
        {
          message: 'Could not get nutrition info!',
        } satisfies errors.CustomErrorContext,
      ],
    } satisfies FoodGenerateFailAPI);
  }

  console.log(
    `Got nutrition info for ${identifiedfood[0].label}: `,
    nutritionInfo,
  );

  // Save in DB
  const food = await db
    .insert(foodTable)
    .values({
      userId: req.user.id,
      name: identifiedfood[0].label,
      servingUnit: nutritionInfo[0].serving_unit,
      servingQty: nutritionInfo[0].serving_qty,
      calories: nutritionInfo[0].nf_calories,
      imageId: key,
    })
    .returning({ id: foodTable.id });

  return res.status(201).json({
    status: 201,
    data: { id: food[0].id },
  } satisfies FoodGenerateSuccessAPI);
};
