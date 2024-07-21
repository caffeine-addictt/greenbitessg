
import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 p-4">
  <Link
    to="/accountsettings"
    className="flex flex-col items-center justify-center p-6 bg-purple-600 text-white rounded-lg shadow-lg hover:bg-purple-700 transition-colors"
  >
    <div className="text-center">
      <h1 className="text-2xl font-bold mb-2">Complete Profile</h1>
      <h2 className="text-lg mb-4">To update relevant meetings according to your personal profile</h2>
      <Button className="text-lg font-semibold">Build Profile</Button>
    </div>

      </Link>
      <Link
        to="/inviteclient"
        className="flex items-center justify-center p-6 bg-yellow-400 text-white rounded-lg shadow-lg hover:bg-yellow-500"
      >
        <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Send Invoice or proposal</h1>
        <h2 className="text-lg mb-4">Invite existing clients to kickoff projects</h2>
        <Button className="text-lg font-semibold">Invite Client</Button>
        </div>
      </Link>
      <div className="flex items-center justify-center p-6 bg-gray-300 text-gray-800 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Project Updates</h2>
      </div>
      <div className="flex items-center justify-center p-6 bg-gray-300 text-gray-800 rounded-lg shadow-lg">
        <h2 className="text-lg font-semibold">Requests</h2>
      </div>
    </div>
  );
}

export default Home;
