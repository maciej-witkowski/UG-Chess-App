import React, {useState} from "react";
import {Button, Container} from "@material-ui/core";
import {Modal} from "react-bootstrap";
import {ErrorMessage, Field, Form, Formik} from "formik";
import gamesOperations from "../state/games/operations";
import {connect} from "react-redux";

const EditGameBasic = (props) => {

    const initialValues = {
        field: "",
        result: ""
    };

    const validate = (values) => {
        const errors = {};

        if (!values.field) {
            errors.field = "Nie wybrano żadnego pola!"
        }

        if (values.field === "speed" && !values.result) {
            errors.result = "Nie wybrano żadnego rodzaju!"
        }
        if (values.field === "moves") {
            const movesModded = values.result.split(' ');
            if (!(movesModded && movesModded.every(move => move.length <= 5 && move.length > 0))) {
                errors.result = "Błędny format! Każdy ruch musi być oddzielony spacją i nie może być dłuższy niż 5!"
            }
        }

        return errors;
    };

    const createInput = (field) => {
        if (field === "speed") {
            return (
                <div>
                    <label>Wybierz rodzaj gry: </label>
                    <Field
                        as="select"
                        name="result"
                    >
                        <option value="">Wybierz rodzaj...</option>
                        <option value="blitz">Blitz</option>
                        <option value="bullet">Bullet</option>
                        <option value="ultraBullet">Ultra Bullet</option>
                        <option value="rapid">Rapid</option>
                        <option value="classical">Classical</option>
                        <option value="correspondence">Correspondence</option>
                    </Field>
                    <ErrorMessage
                        name={'result'}
                        component="div"
                    />
                </div>
            )
        } else if (field === "moves") {
            return (
                <div>
                    <label>Podaj wszystkie ruchy w partii: </label>
                    <Field
                        name="result"
                        type="text"
                    />
                    <ErrorMessage
                        name={'result'}
                        component="div"
                    />
                </div>
            )
        }
    }

    const [show, setShow] = useState(false);

    return (
        <div>
            <Container>
                <Button variant="contained" color="primary" onClick={() => setShow(true)}>
                    Edytuj bazowe informacje
                </Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Formik
                        initialValues={initialValues}
                        validate={(values => validate(values))}
                        onSubmit={async (values) => {
                            const vals = Object.values(values);
                            const obj = {};
                            obj[vals[0]] = vals[1]

                            props.changeGame(props.gameId, obj)

                            setShow(false);

                            // props.fetchGames();
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <Modal.Header closeButton>
                                    <Modal.Title>Edytuj</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div>
                                        <label>Wybierz pole, które chcesz zmienić: </label>
                                        <Field
                                            as="select"
                                            name="field"
                                        >
                                            <option value="">Wybierz pole...</option>
                                            <option value="speed">Tryb gry</option>
                                            <option value="moves">Historia ruchów</option>
                                        </Field>
                                        <ErrorMessage
                                            name={'field'}
                                            component="div"
                                        />
                                    </div>
                                    {values.field ? (
                                        <div>
                                            {createInput(values.field)}
                                        </div>
                                    ) : ""}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="contained" color="primary" onClick={() => setShow(false)}>
                                        Zamknij
                                    </Button>
                                    <Button type="submit" variant="contained" color="primary">
                                        Dodaj
                                    </Button>
                                </Modal.Footer>
                            </Form>
                        )}
                    </Formik>
                </Modal>
            </Container>
        </div>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: () => {
            dispatch(gamesOperations.getGames());
        },
        changeGame: (gameId, changes) => {
            dispatch(gamesOperations.changeGame(gameId, changes));
        }
    }
}

export default connect(null, mapDispatchToProps)(EditGameBasic);