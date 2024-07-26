import { Button } from '@components/ui/button';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <Link to="/accountsettings">
        <div className="text-center">
          <h1>Complete Profile</h1>
          <h2>
            To update relevant meetings according to your personal profile
          </h2>
          <Button>Build Profile</Button>
        </div>
      </Link>
      <Link to="/inviteclient">
        <div className="text-center">
          <h1>Send Invoice or proposal</h1>
          <h2>Invite existing clients to kickoff projects</h2>
          <Button>Invite Client</Button>
        </div>
      </Link>
      <div>
        <h2 className="text-lg font-semibold">Project Updates</h2>
      </div>
      <div>
        <h2>Requests</h2>
      </div>
    </div>
  );
}

export default Home;
