import "./App.css";
import { BroswerRouter, BrowserRouter, Route } from "react-router-dom";
import PostList from "../pages/PostList";

function App() {
    return (
        <>
            <BrowserRouter>
                <Route path="/" component={PostList} exact />
            </BrowserRouter>
        </>
    );
}

export default App;
