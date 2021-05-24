import React, {useState} from "react";
import {connect} from "react-redux";
import gamesOperations from "../state/games/operations";
import {Button, Container} from "@material-ui/core";
import {Modal} from "react-bootstrap";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import commentsOperations from "../state/comments/operations";
import * as Yup from "yup";

const NewCommentForm = ({addComment, fetchGames, gameId}) => {

    const [show, setShow] = useState(false);

    const initialValues = {
        comments: [{
            game_id: "",
            author: "",
            text: ""
        }]
    };

    const CommentsSchema = Yup.object().shape({
        comments: Yup.array()
            .of(Yup.object().shape({
                author: Yup.string()
                    .required("Nazwa użytkownika nie może być pusta!"),
                text: Yup.string()
                    .max(120, "Komentarz nie może być dłuższy niż 120 znaków!")
                    .required("Komentarz nie może być pusty!"),
            }))
    })

    return (
        <div>
            <Container>
                <Button variant="contained" color="primary" onClick={() => setShow(true)}>
                    Napisz komentarz
                </Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Formik
                        initialValues={initialValues}
                        validationSchema={CommentsSchema}
                        onSubmit={async (values) => {
                            await values.comments.forEach(comment => comment.game_id = gameId);

                            for (const comment of values.comments) {
                                await addComment(gameId, comment);
                            }

                            setShow(false);

                            fetchGames();
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <Modal.Header closeButton>
                                    <Modal.Title>Nowy komentarz</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <FieldArray name="comments">
                                        {({ remove, push }) => (
                                            <div>
                                                {values.comments.length > 0 &&
                                                values.comments.map((comment, index) => (
                                                    <div key={index}>
                                                        <div>
                                                            <label>Podaj autora komentarza: </label>
                                                            <Field
                                                                name={`comments.${index}.author`}
                                                                type="text"
                                                            />
                                                            <ErrorMessage
                                                                name={`comments.${index}.author`}
                                                                component="div"
                                                            />
                                                        </div>
                                                        <div>
                                                            <label>Podaj treść komentarza: </label>
                                                            <Field
                                                                name={`comments.${index}.text`}
                                                                type="text"
                                                            />
                                                            <ErrorMessage
                                                                name={`comments.${index}.text`}
                                                                component="div"
                                                            />
                                                        </div>
                                                        <div>
                                                            <button
                                                                type="button"
                                                                onClick={() => remove(index)}
                                                            >
                                                                X
                                                            </button>
                                                        </div>
                                                    </div>
                                                ))}
                                                <button
                                                    type="button"
                                                    onClick={() => push({author: "", text: "", game_id: gameId})}
                                                >
                                                    Kolejny komentarz
                                                </button>
                                            </div>
                                        )}
                                    </FieldArray>
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
        addComment: (game_id, comment) => {
            dispatch(commentsOperations.addComment(game_id, comment))
        }
    }
}

export default connect(null, mapDispatchToProps)(NewCommentForm);