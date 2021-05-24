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

        if (values.field === "initial") {
            if (isNaN(values.result) || parseInt(values.result) < 0) {
                errors.result = "Nieprawidłowy czas startowego!"
            }
        }
        if (values.field === "increment") {
            if (isNaN(values.result) || parseInt(values.result) < 0) {
                errors.result = "Podano nieprawidłowy czas dodatkowy!"
            }
        }
        if (values.field === "totalTime") {
            if (isNaN(values.result)) {
                errors.result = "Nieprawidłowy czas końcowy! Pamiętaj czas końcowy nie może być krótszy od początkowego!"
            }
        }

        return errors;
    };

    const createInput = (field) => {
        if (field === "initial") {
            return (
                <div>
                    <label>Podaj dodatkową ilość sekund przyznawaną po każdym ruchu: </label>
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
        } else if (field === "increment") {
            return (
                <div>
                    <label>Podaj dodatkową ilość sekund przyznawaną po każdym ruchu: </label>
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
        } else if (field === "totalTime") {
            return (
                <div>
                    <label>Podaj czas trwania całej partii: </label>
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
                    Edytuj czas
                </Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Formik
                        initialValues={initialValues}
                        validate={(values => validate(values))}
                        onSubmit={async (values) => {
                            const obj = {
                                clock: props.game.clock
                            };
                            obj.clock[values.field] = parseInt(values.result)

                            console.log(obj)

                            props.changeGame(props.game._id, obj)

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
                                            <option value="initial">Bazowa ilość czasu</option>
                                            <option value="increment">Dodatkowa ilość czasu</option>
                                            <option value="totalTime">Całkowita ilość czasu</option>
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