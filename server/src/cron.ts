/**
 * SPDX-FileCopyrightText: 2024 Ng Jun Xiang <contact@ngjx.org>
 *
 * SPDX-License-Identifier: GPL-3.0-only
 */

import { lt } from 'drizzle-orm';

import { db } from './db';
import { jwtTokenBlocklist } from './db/schemas';

type JobSync = () => string | void;
type JobAsync = () => Promise<string | void>;
type Job = JobSync | JobAsync;

interface JobInfo {
  /** Interval in ms */
  interval: number;

  /**
   * Execute function
   * @returns The job execution summary [Defaults to just the job name]
   */
  exec: Job;
}

type JobsType = { [name: string]: JobInfo };
const jobs: JobsType = {
  'JWT blocklist cleanup': {
    interval: 60 * 60 * 1000, // 1 hour
    exec: async () =>
      `deleted ${(await db.delete(jwtTokenBlocklist).where(lt(jwtTokenBlocklist.exp, new Date())).returning()).length} rows`,
  },
} as const;

/** Entrypoint for jobs */
export const startBackgroundJobs = () => {
  console.log('Starting background jobs...');

  const loadedJobs: ReturnType<typeof setInterval>[] = [];
  for (const [name, info] of Object.entries(jobs)) {
    loadedJobs.push(
      setInterval(() => {
        const start = Date.now();

        // Invoke job
        (async () => {
          const summary = await Promise.resolve(info.exec());

          // StdOut
          const elapsed = (Date.now() - start).toPrecision(6); // 6sf
          console.log(
            `CRON "${name}"${summary ? ` "${summary}"` : ''} - ${elapsed} ms`,
          );
        })();
      }, info.interval),
    );
  }

  // StdOut
  console.log(`Started ${loadedJobs.length} background jobs`);

  // Cleanup
  return () => {
    for (const job of loadedJobs) {
      clearInterval(job);
    }
  };
};
