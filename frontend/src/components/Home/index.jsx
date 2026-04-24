import {Component} from "react"
import {Link} from "react-router-dom"

import Header from "../Header";

import "./index.css"

class Home extends Component {
    render(){
        return (
            <div className = "home-container">
                <Header />
                <div className="banner-container">
                    <div className="banner-content-container">
                    <h1 className="banner-heading">Booksy</h1>
                  <p className="banner-text">
Booksy is an online bookstore built to inspire a love for reading.  
We bring together stories that educate, entertain, and empower readers of all ages.  
From timeless classics to modern bestsellers, every book is carefully curated for you.  
At Booksy, reading is more than a habit — it’s a journey.
</p>

<p className="banner-text">
Discover a wide collection of books across genres, all in one place.  
Whether you’re exploring something new or revisiting a favorite, Booksy makes reading accessible and enjoyable.  
With a growing community of book lovers, we create a space to explore, learn, and connect.  
Booksy is where stories begin.
</p>

                        <Link to="/books" className="nav-link">
                            <button className="explore-button">Explore Books</button>
                        </Link>
                    </div>
                </div>
            </div>
        );
    }
}

export default Home