import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { useState } from "react";
import NavBar from "./components/NavBar";
import SortSelector from "./components/SortSelector";
import SongGrid from "./components/SongGrid";
import SongDetails from "./components/SongDetails";

export interface SongQuery {
  sortOrder: string;
}
// npm run dev
function App() {
  const [songQuery, setSongQuery] = useState<SongQuery>({} as SongQuery);

  return (
    <Router>
      <div>
        <NavBar />
        <Switch>
          <Route exact path="/">
            <div>
              <SortSelector
                sortOrder={songQuery.sortOrder}
                onSelectSortOrder={(sortOrder) =>
                  setSongQuery({ ...songQuery, sortOrder })
                }
              />
              <SongGrid songQuery={songQuery} />
            </div>
          </Route>
          <Route path="/songs/:id" component={SongDetails} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
