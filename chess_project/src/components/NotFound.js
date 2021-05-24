import React from "react";
import {Button, Jumbotron} from "react-bootstrap";

const NotFound = () => {

    return (
        <div>
            <Jumbotron>
                <h1>Błąd! Brak danych dla tej gry!</h1>
                <p>
                    Pamiętaj, aby załadować najpierw pełną listę gier z bazy danych, a następnie przeglądaj poszczególne partie!
                </p>
                <p>
                    <Button href="/" variant="primary">Wróć do strony głównej</Button>
                </p>
            </Jumbotron>
        </div>
    )
};

export default NotFound;