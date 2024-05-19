import { useDatabase, DATABASE_STATUS } from '../hooks/useDatabase'
import Loader from './Loader'
import Schema from './Schema'
import Command from './Command'
import Controls from './Controls';

const App = () => {
    const { databaseStatus, loadDatabase, execCommand, closeDatabase, exportDatabase } = useDatabase();
    const getDbData = async () => {
      const response = await fetch("/api/db/dbfile");
      const rawData = await response.json();
      return Buffer.from(rawData.base64, "base64");
    };
  
    const initDbData = () => {
      getDbData()
        .then((data) => {
          loadDatabase(data);
        })
        .catch((e) => {
          debugger;
        });
    };

    switch (databaseStatus) {
        case DATABASE_STATUS.busy:
            return <Loader />

        case DATABASE_STATUS.notLoaded:
          return <>{initDbData()}</>;
          
        case DATABASE_STATUS.ready:
        case DATABASE_STATUS.runningCommand:
        default:
            return (
                <>
                    <Controls closeDatabase={closeDatabase} exportDatabase={exportDatabase} />

                    <div className="row">
                        <div className="col-md-3">
                            <Schema execCommand={execCommand} />
                        </div>

                        <div className="col-md-9">
                            <Command execCommand={execCommand} />
                        </div>
                    </div>
                </>
            );
    }
};

export default App;
