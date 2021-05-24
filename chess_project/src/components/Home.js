import React, {useEffect} from "react";
import {Jumbotron} from "react-bootstrap";
import gamesOperations from "../state/games/operations";
import {connect} from "react-redux";

const Home = ({fetchGames}) => {

    useEffect(() => {
        fetchGames()
    }, [fetchGames]);

    return (
        <div>
            <Jumbotron>
                <h1>Witaj w świecie bierek!</h1>
                <p>
                    Ta strona pozwoli ci prześledzić ograniczoną bazę historycznych partii szachowych.
                    Dodawaj nowe, usuwaj niechciane, zmieniaj niedoskonałe. Baw się do woli!
                </p>
            </Jumbotron>
        </div>
    )
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: () => {
            dispatch(gamesOperations.getGames());
        }
    }
}

export default connect(null, mapDispatchToProps)(Home);
