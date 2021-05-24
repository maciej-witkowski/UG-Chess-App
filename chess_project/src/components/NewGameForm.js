import React, {useState} from "react";
import {connect} from "react-redux";
import gamesOperations from "../state/games/operations";
import {Button, Card, Container} from "@material-ui/core";
import {Modal, Tab, Tabs} from "react-bootstrap";
import {ErrorMessage, Field, FieldArray, Form, Formik} from "formik";
import * as Yup from 'yup'
import commentsOperations from "../state/comments/operations";

const NewGameForm = ({addGame, addComment, fetchGames}) => {

    const [show, setShow] = useState(false);
    const [key, setKey] = useState('basic');

    const initialValues = {
        game_id: "",
        rated: false,
        speed: "",
        createdAt: "",
        lastMoveAt: "",
        status: "",
        winner: "",
        moves: "",
        players: {
            white: {
                user: {
                    name: "",
                },
                rating: "",
                ratingDiff: ""
            },
            black: {
                user: {
                    name: "",
                },
                rating: "",
                ratingDiff: ""
            }
        },
        clock: {
            initial: "",
            increment: 0,
            totalTime: ""
        },
        comments: [{
            author: "",
            text: "",
        }]
    };

    const validate = (values) => {
        const errors = {
            game_id: "",
            speed: "",
            createdAt: "",
            lastMoveAt: "",
            status: "",
            winner: "",
            moves: "",
            players: {
                white: {
                    user: {
                        name: ""
                    },
                    rating: "",
                    ratingDiff: ""
                },
                black: {
                    user: {
                        name: ""
                    },
                    rating: "",
                    ratingDiff: ""
                }
            },
            clock: {
                initial: "",
                increment: "",
                totalTime: ""
            }
        };

        const createDate = new Date(values.createdAt);
        const finishDate = new Date(values.lastMoveAt);
        const currDate = new Date();

        const movesModded = values.moves.split(' ');

        if (values.game_id.length !== 8) {
            errors.game_id = "ID partii musi mieć długość dokładnie 8 znaków!"
        }
        if (!values.speed) {
            errors.speed = "Nie wybrano żadnego rodzaju!"
        }
        if (currDate.getTime() <= createDate.getTime()) {
            errors.createdAt = "Data rozpoczęcia jest nieprawidłowa!"
        }
        if (finishDate.getTime() <= createDate.getTime()) {
            errors.lastMoveAt = "Data zakończenia nie może być wcześniej niż data rozpoczęcia!"
        }
        if (!values.status) {
            errors.status = "Nie wybrano żadnego rezultatu!"
        }
        if (!values.winner && values.status !== 'draw') {
            errors.winner = "Nie wybrano żadnego zwycięzcy!"
        }
        if (!(movesModded && movesModded.every(move => move.length <= 5 && move.length > 0))) {
            errors.moves = "Błędny format! Każdy ruch musi być oddzielony spacją i nie może być dłuższy niż 5!"
        }

        if (!values.players.white.user.name) errors.players.white.user.name = "Nazwa użytkownika nie może być pusta!";
        else if (values.players.white.user.name.length > 32) errors.players.white.user.name = "Nazwa użytkownika nie może być mieć więcej niż 32 znaki!";
        else if (values.players.white.user.name === values.players.black.user.name) errors.players.white.user.name = "Nazwa użytkownika nie może być taka sama jak nazwa przeciwnika!";

        if (!values.players.black.user.name) errors.players.black.user.name = "Nazwa użytkownika nie może być pusta!";
        else if (values.players.black.user.name.length > 32) errors.players.black.user.name = "Nazwa użytkownika nie może być mieć więcej niż 32 znaki!";
        else if (values.players.black.user.name === values.players.white.user.name) errors.players.black.user.name = "Nazwa użytkownika nie może być taka sama jak nazwa przeciwnika!";

        if (!values.players.white.rating) errors.players.white.rating = "Wartość rankingu nie może być pusta!";
        else if (parseInt(values.players.white.rating) > 4000 || parseInt(values.players.white.rating) < 0) errors.players.white.rating = "Wartość rankingu musi znajdować się pomiędzy 0 a 4000 punktów!";

        if (!values.players.black.rating) errors.players.black.rating = "Wartość rankingu nie może być pusta!";
        else if (parseInt(values.players.black.rating) > 4000 || parseInt(values.players.black.rating) < 0) errors.players.black.rating = "Wartość rankingu musi znajdować się pomiędzy 0 a 4000 punktów!";

        if (!values.players.white.ratingDiff) errors.players.white.ratingDiff = "Różnica w rankingu po partii nie może być pusta!";
        if (values.winner === 'white' && parseInt(values.players.white.ratingDiff) > parseInt(values.players.white.rating)) errors.players.white.ratingDiff = "Punkty zdobyte w partii nie mogą być wyższe od samego rankingu!"
        if (values.winner === 'white' && parseInt(values.players.white.ratingDiff) <= 0) errors.players.white.ratingDiff = "Po wygranej partii róznica w rankingu powinna być dodatnia!"
        if (values.winner === 'black' && parseInt(values.players.white.ratingDiff) < -Math.abs(values.players.white.rating)) errors.players.white.ratingDiff = "Punkty stracone w partii nie mogą być wyższe od samego rankingu!"
        if (values.winner === 'black' && parseInt(values.players.white.ratingDiff) >= 0) errors.players.white.ratingDiff = "Po przegranej partii róznica w rankingu powinna być ujemna!"

        if (!values.players.black.ratingDiff) errors.players.black.ratingDiff = "Różnica w rankingu po partii nie może być pusta!";
        if (values.winner === 'black' && parseInt(values.players.black.ratingDiff) > parseInt(values.players.black.rating)) errors.players.black.ratingDiff = "Punkty zdobyte w partii nie mogą być wyższe od samego rankingu!"
        if (values.winner === 'black' && parseInt(values.players.black.ratingDiff) <= 0) errors.players.black.ratingDiff = "Po wygranej partii róznica w rankingu powinna być dodatnia!"
        if (values.winner === 'white' && parseInt(values.players.black.ratingDiff) < -Math.abs(values.players.black.rating)) errors.players.black.ratingDiff = "Punkty stracone w partii nie mogą być wyższe od samego rankingu!"
        if (values.winner === 'white' && parseInt(values.players.black.ratingDiff) >= 0) errors.players.black.ratingDiff = "Po przegranej partii róznica w rankingu powinna być ujemna!"

        if (isNaN(values.clock.initial) || parseInt(values.clock.initial) < 0) {
            errors.clock.initial = "Nieprawidłowy czas startowego!"
        }
        if (isNaN(values.clock.increment) || parseInt(values.clock.increment) < 0) {
            errors.clock.increment = "Podano nieprawidłowy czas dodatkowy!"
        }
        if (isNaN(values.clock.totalTime) || parseInt(values.clock.totalTime) < parseInt(values.clock.initial)) {
            errors.clock.totalTime = "Nieprawidłowy czas końcowy! Pamiętaj czas końcowy nie może być krótszy od początkowego!"
        }

        const errorsFlatten = {
            game_id: errors.game_id,
            speed: errors.speed,
            createdAt: errors.createdAt,
            lastMoveAt: errors.lastMoveAt,
            status: errors.status,
            winner: errors.winner,
            moves: errors.moves,
            playerWhiteName: errors.players.white.user.name,
            playerWhiteRating: errors.players.white.rating,
            playerWhiteRatingDiff: errors.players.white.ratingDiff,
            playerBlackName: errors.players.black.user.name,
            playerBlackRating: errors.players.black.rating,
            playerBlackRatingDiff: errors.players.black.ratingDiff,
            clockInitial: errors.clock.initial,
            clockIncrement: errors.clock.increment,
            clockTotalTime: errors.clock.totalTime
        }
        const isEmpty = Object.values(errorsFlatten).every(error => error === "");

        return isEmpty ? {} : errors;
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
                    Nowa partia
                </Button>
                <Modal show={show} onHide={() => setShow(false)}>
                    <Formik
                        initialValues={initialValues}
                        validate={(values => validate(values))}
                        validationSchema={CommentsSchema}
                        onSubmit={async (values) => {
                            values.players.white.user.id = values.players.white.user.name;
                            values.players.black.user.id = values.players.black.user.name;

                            values.players.white.rating = parseInt(values.players.white.rating);
                            values.players.black.rating = parseInt(values.players.black.rating);

                            values.players.white.ratingDiff = parseInt(values.players.white.ratingDiff);
                            values.players.black.ratingDiff = parseInt(values.players.black.ratingDiff);

                            values.variant = "standard";
                            values.perf = values.speed;

                            if (values.status === "draw") delete values.winner;

                            values.clock.initial = parseInt(values.clock.initial);
                            values.clock.increment = parseInt(values.clock.increment);
                            values.clock.totalTime = parseInt(values.clock.totalTime);

                            await values.comments.forEach(comment => comment.game_id = values.game_id);

                            console.log(values);
                            const commentsToAdd = values.comments;
                            values.comments = [];

                            addGame(values);
                            for (const comment of commentsToAdd) {
                                await addComment(values.game_id, comment);
                            }

                            setShow(false);

                            fetchGames();
                        }}
                    >
                        {({ values }) => (
                            <Form>
                                <Modal.Header closeButton>
                                    <Modal.Title>Nowa partia</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Tabs
                                        id="controlled-tab"
                                        activeKey={key}
                                        onSelect={(k) => setKey(k)}
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'row'
                                        }}
                                    >
                                        <Tab eventKey="basic" title="Informacje" tabClassName="p-1">
                                            <div>
                                                <label>Podaj ID gry: </label>
                                                <Field
                                                    name="game_id"
                                                    type="text"
                                                />
                                                <ErrorMessage
                                                    name={'game_id'}
                                                    component="div"
                                                />
                                            </div>
                                            <div>
                                                <label>Czy gra była rozegrana w trybie rankingowym?</label>
                                                <Field
                                                    type="checkbox"
                                                    name="rated"
                                                />
                                            </div>
                                            <div>
                                                <label>Wybierz rodzaj gry: </label>
                                                <Field
                                                    as="select"
                                                    name="speed"
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
                                                    name={'speed'}
                                                    component="div"
                                                />
                                            </div>
                                            <div>
                                                <label>Podaj datę rozpoczęcia: </label>
                                                <Field
                                                    name="createdAt"
                                                    type="datetime-local"
                                                />
                                                <ErrorMessage
                                                    name={'createdAt'}
                                                    component="div"
                                                />
                                            </div>
                                            <div>
                                                <label>Podaj datę zakończenia: </label>
                                                <Field
                                                    name="lastMoveAt"
                                                    type="datetime-local"
                                                />
                                                <ErrorMessage
                                                    name={'lastMoveAt'}
                                                    component="div"
                                                />
                                            </div>
                                            <div>
                                                <label>Podaj rezultat partii: </label>
                                                <Field
                                                    as="select"
                                                    name="status"
                                                >
                                                    <option value="">Wybierz rezultat...</option>
                                                    <option value="mate">Szach-Mat</option>
                                                    <option value="resign">Poddanie</option>
                                                    <option value="outoftime">Koniec czasu</option>
                                                    <option value="draw">Remis</option>
                                                </Field>
                                                <ErrorMessage
                                                    name={'status'}
                                                    component="div"
                                                />
                                            </div>
                                            {(values.status !== "draw") ? (
                                                <div>
                                                    <label>Podaj zwycięzce partii: </label>
                                                    <Field
                                                        as="select"
                                                        name="winner"
                                                    >
                                                        <option value="">Wybierz zwycięzce...</option>
                                                        <option value="white">Białe bierki</option>
                                                        <option value="resign">Czarne bierki</option>
                                                    </Field>
                                                    <ErrorMessage
                                                        name={'winner'}
                                                        component="div"
                                                    />
                                                </div>
                                            ) : ""}
                                            <div>
                                                <label>Podaj wszystkie ruchy w partii: </label>
                                                <Field
                                                    name="moves"
                                                    type="text"
                                                />
                                                <ErrorMessage
                                                    name={'moves'}
                                                    component="div"
                                                />
                                            </div>
                                        </Tab>
                                        <Tab eventKey="players" title="Zawodnicy" tabClassName="p-1">
                                            <Card>
                                                <div>
                                                    <label>Podaj nazwę użytkownika (białe): </label>
                                                    <Field
                                                        name="players.white.user.name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.white.user.name'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj ranking: (białe): </label>
                                                    <Field
                                                        name="players.white.rating"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.white.rating'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj różnicę w rankingu po partii (białe): </label>
                                                    <Field
                                                        name="players.white.ratingDiff"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.white.ratingDiff'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj tytuł gracza (białe): </label>
                                                    <Field
                                                        as="select"
                                                        name="players.white.user.title"
                                                    >
                                                        <option value="">Wybierz tytuł...</option>
                                                        <option value="GM">Arcymistrz (GM)</option>
                                                        <option value="WGM">Arcymistrzyni (WGM)</option>
                                                        <option value="IM">Mistrz (IM)</option>
                                                        <option value="WIM">Mistrzyni (WIM)</option>
                                                        <option value="FM">Mistrz FIDE (FM)</option>
                                                        <option value="WFM">Mistrzyni FIDE (WFM)</option>
                                                        <option value="CM">Kandydat na mistrza FIDE (CM)</option>
                                                        <option value="WCM">Kandydatka na mistrzynię FIDE (WCM)</option>
                                                        <option value="BOT">BOT</option>
                                                    </Field>
                                                </div>
                                            </Card>
                                            <Card>
                                                <div>
                                                    <label>Podaj nazwę użytkownika (czarne): </label>
                                                    <Field
                                                        name="players.black.user.name"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.black.user.name'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj ranking: (czarne): </label>
                                                    <Field
                                                        name="players.black.rating"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.black.rating'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj różnicę w rankingu po partii (czarne): </label>
                                                    <Field
                                                        name="players.black.ratingDiff"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'players.black.ratingDiff'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj tytuł gracza (czarne): </label>
                                                    <Field
                                                        as="select"
                                                        name="players.black.user.title"
                                                    >
                                                        <option value="">Wybierz tytuł...</option>
                                                        <option value="GM">Arcymistrz (GM)</option>
                                                        <option value="WGM">Arcymistrzyni (WGM)</option>
                                                        <option value="IM">Mistrz (IM)</option>
                                                        <option value="WIM">Mistrzyni (WIM)</option>
                                                        <option value="FM">Mistrz FIDE (FM)</option>
                                                        <option value="WFM">Mistrzyni FIDE (WFM)</option>
                                                        <option value="CM">Kandydat na mistrza FIDE (CM)</option>
                                                        <option value="WCM">Kandydatka na mistrzynię FIDE (WCM)</option>
                                                        <option value="BOT">BOT</option>
                                                    </Field>
                                                </div>
                                            </Card>
                                        </Tab>
                                        <Tab eventKey="clock" title="Czas" tabClassName="p-1">
                                            <Card>
                                                <div>
                                                    <label>Podaj bazową ilość czasu (w sekundach): </label>
                                                    <Field
                                                        name="clock.initial"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'clock.initial'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj dodatkową ilość sekund przyznawaną po każdym ruchu: </label>
                                                    <Field
                                                        name="clock.increment"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'clock.increment'}
                                                        component="div"
                                                    />
                                                </div>
                                                <div>
                                                    <label>Podaj czas trwania całej partii: </label>
                                                    <Field
                                                        name="clock.totalTime"
                                                        type="text"
                                                    />
                                                    <ErrorMessage
                                                        name={'clock.totalTime'}
                                                        component="div"
                                                    />
                                                </div>
                                            </Card>
                                        </Tab>
                                        <Tab eventKey="comments" title="Komentarze" tabClassName="p-1">
                                            <div>
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
                                                                onClick={() => push({author: "", text: ""})}
                                                            >
                                                                Kolejny komentarz
                                                            </button>
                                                        </div>
                                                    )}
                                                </FieldArray>
                                            </div>
                                        </Tab>
                                    </Tabs>
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
        addGame: (game) => {
            dispatch(gamesOperations.addGame(game))
        },
        addComment: (game_id, comment) => {
            dispatch(commentsOperations.addComment(game_id, comment))
        }
    }
}

export default connect(null, mapDispatchToProps)(NewGameForm);
