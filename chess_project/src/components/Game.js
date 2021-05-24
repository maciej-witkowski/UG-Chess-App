import React from 'react';
import {connect} from "react-redux";
import {Card, Image, Container, Row, Col, ListGroup, ListGroupItem, Toast} from 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css';
import NewCommentForm from "./NewCommentForm";
import gamesOperations from "../state/games/operations";
import commentsOperations from "../state/comments/operations";
import NotFound from "./NotFound";
import EditGameBasic from "./EditGameBasic";
import {ButtonGroup} from "@material-ui/core";
import EditGameClock from "./EditGameClock";

const Game = (props) => {

    const game = props.games.find(game => game.game_id === props.match.params.id);

    const commentDate = (date, option) => {
        const result = new Date(date);

        const dateFormat = (result.getDate() < 10 ? "0"+result.getDate() : result.getDate())+
            "/"+
            ((result.getMonth()+1) < 10 ? "0"+(result.getMonth()+1) : (result.getMonth()+1))+
            "/"+
            result.getFullYear()

        if (option === 'time') {
            return (result.getHours() < 10 ? "0"+result.getHours() : result.getHours())+
                ":"+
                (result.getMinutes() < 10 ? "0"+result.getMinutes() : result.getMinutes())+
                " "+dateFormat
        } else {
            return dateFormat
        }

    }

    return (
        <div>
            { game ? (
                <Container fluid>
                    <Row>
                        <Col xs={12} lg={8}>
                            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1.5rem'}}>
                                <Card style={{width: '100%'}}>
                                    <Card.Header>
                                        <Card.Title>
                                            {(game.clock.initial / 60)} + {game.clock.increment}
                                            <span style={{ display: 'inline-block', margin: '0 15px', transform: 'scale(1.0)'}}>•</span>
                                            {(game.speed).toUpperCase()}
                                            <span style={{ display: 'inline-block', margin: '0 15px', transform: 'scale(1.0)'}}>•</span>
                                            {game.ranked ? "RANKINGOWA" : "TOWARZYSKA"}
                                        </Card.Title>
                                        <Card.Subtitle className={"text-muted"}>
                                            {commentDate(game.createdAt, 'date')}
                                        </Card.Subtitle>
                                    </Card.Header>
                                    <Card.Body style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <Container>
                                            <Row style={{ textAlign: 'center' }}>
                                                <Col xs={12} md={4}>
                                                    <span style={{ fontSize: '2rem' }}>{String.fromCharCode(9812)}</span>
                                                    <Card.Title style={{ paddingInline: '1rem' }}>{game.players.white.user.name}</Card.Title>
                                                    <div style={{ display: 'inline-flex' }}>
                                                        <Card.Text style={{ paddingRight: '.5rem' }}>({game.players.white.rating})</Card.Text>
                                                        {game.players.white.ratingDiff > 0 ? (
                                                            <Card.Text style={{ color: 'green' }}>{"+"+game.players.white.ratingDiff}</Card.Text>
                                                        ) : (
                                                            <Card.Text style={{ color: 'red' }}>{game.players.white.ratingDiff}</Card.Text>
                                                        )}
                                                    </div>
                                                </Col>
                                                <Col xs={12} md={4}>
                                                    <p style={{ paddingInline: '2rem' }}>VS.</p>
                                                </Col>
                                                <Col xs={12} md={4}>
                                                    <span style={{ fontSize: '2rem' }}>{String.fromCharCode(9818)}</span>
                                                    <Card.Title style={{ paddingInline: '1rem' }}>{game.players.black.user.name}</Card.Title>
                                                    <div style={{ display: 'inline-flex' }}>
                                                        <Card.Text style={{ paddingRight: '.5rem' }}>({game.players.black.rating})</Card.Text>
                                                        {game.players.black.ratingDiff > 0 ? (
                                                            <Card.Text style={{ color: 'green' }}>{"+"+game.players.black.ratingDiff}</Card.Text>
                                                        ) : (
                                                            <Card.Text style={{ color: 'red' }}>{game.players.black.ratingDiff}</Card.Text>
                                                        )}
                                                    </div>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Card.Body>
                                    <Card.Body>
                                        <Container>
                                            <Row style={{display: 'flex', justifyContent: 'start', alignItems: 'end'}}>
                                                <Col lg={1.5}>
                                                    <Card.Text style={{fontWeight: '600'}}>Rezultat:</Card.Text>
                                                </Col>
                                                <Col lg={10}>
                                                    <Card.Text>
                                                        {
                                                            game.status === 'mate' ? "Szach-Mat" :
                                                                game.status === 'resign' ? "Poddanie" :
                                                                    game.status === 'outoftime' || game.status === 'timeout' ? "Koniec czasu" :
                                                                        game.status === 'draw' ? "Remis" : ""
                                                        }
                                                        {
                                                            game.winner === 'white' ? ", Zwycięstwo białych" :
                                                                game.winner === 'black' ? ", Zwycięstwo czarnych" : ""
                                                        }
                                                    </Card.Text>
                                                </Col>
                                            </Row>
                                        </Container>
                                    </Card.Body>
                                    <Card.Header>
                                        <Card.Text>Historia ruchów</Card.Text>
                                    </Card.Header>
                                    <ListGroup className="list-group-flush">
                                        <ListGroupItem>{game.moves}</ListGroupItem>
                                    </ListGroup>
                                    <Card.Body>
                                        <ButtonGroup>
                                            <EditGameBasic gameId={game._id}/>
                                            <EditGameClock game={game}/>
                                        </ButtonGroup>
                                    </Card.Body>
                                </Card>
                                <hr />
                                <Card style={{width: '100%'}}>
                                    <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                                        <Card.Title>Komentarze: </Card.Title>
                                        <NewCommentForm gameId={game.game_id}/>
                                    </Card.Header>
                                    <Card.Body>
                                        <ListGroup className="list-group-flush">
                                            {game.comments.map(comment => (
                                                <ListGroupItem key={comment._id}>
                                                    <Toast style={{maxWidth: '100%'}} onClose={() => {
                                                        props.deleteComment(game.game_id, comment._id)
                                                        props.fetchGames();
                                                    }}>
                                                        <Toast.Header>
                                                            <strong className="mr-auto">{comment.author}</strong>
                                                            <small>{commentDate(comment.date, 'time')}</small>
                                                        </Toast.Header>
                                                        <Toast.Body>{comment.text}</Toast.Body>
                                                    </Toast>
                                                </ListGroupItem>
                                            ))}
                                        </ListGroup>
                                    </Card.Body>
                                </Card>
                            </div>
                        </Col>
                        <Col style={{display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem'}} xs={12} lg={4}>
                            <Image style={{borderRadius: '1rem', boxShadow: '0 10px 16px 0 rgba(0,0,0,0.2),0 6px 20px 0 rgba(0,0,0,0.19)'}} src={`https://lichess1.org/game/export/gif/${props.match.params.id}.gif`} fluid />
                        </Col>
                    </Row>
                </Container>
            ) : (
                <NotFound/>
            )}
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        games: state.games
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: () => {
            dispatch(gamesOperations.getGames());
        },
        deleteComment: (gameId, commentId) => {
            dispatch(commentsOperations.deleteComment(gameId, commentId))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Game);

