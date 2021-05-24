import React, {useEffect} from 'react';
import {connect} from "react-redux";
import gamesOperations from "../state/games/operations";
import {Link} from 'react-router-dom'
import '../css/Games.css'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    Container,
    Grid,
    makeStyles,
    Typography
} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import {sortByDate, sortByMoves, sortByRating} from "../state/games/actions";
import commentsOperations from "../state/comments/operations";

const Games = ({games, fetchGames, deleteGame, deleteComment, sortByDate, sortByMoves, sortByRating}) => {

    useEffect(() => {
        fetchGames()
    }, [fetchGames]);

    const sortBy = (event) => {
        const value = event.target.value;
        const direction = value.endsWith('desc') ? "desc" : "asc";

        if (value.startsWith('date')) {
            sortByDate(direction);
        } else if (value.startsWith('moves')) {
            sortByMoves(direction);
        } else if (value.startsWith('rating')) {
            sortByRating(direction);
        }
    }

    const useStyles = makeStyles((theme) => ({
        cardGrid: {
            paddingTop: theme.spacing(8),
            paddingBottom: theme.spacing(8),
        },
        card: {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#f8f8f8'
        },
        cardMedia: {
            paddingTop: '56.25%',
        },
        cardContent: {
            flexGrow: 1,
        },
        bullet: {
            display: 'inline-block',
            margin: '0 10px',
            transform: 'scale(1.0)',
        },
        title: {
            backgroundColor: '#b33430',
            borderRadius: '.3rem',
            color: '#fff',
            padding: '.2rem .3rem',
            marginRight: '.3rem',
        },
        rating: {
            marginLeft: '.3rem',
        },
    }));

    const classes = useStyles();
    const bull = <span className={classes.bullet}>•</span>;

    return (
        <div>
            <Container className={classes.cardGrid} maxWidth="md">
                <Grid container spacing={4}>
                    {games.map(game => (
                        <Grid item key={game._id} xs={12} sm={6} md={4}>
                            <Card className={classes.card}>
                                <CardContent className={classes.cardContent}>
                                    <Typography gutterBottom variant="h5" component="h3" align="center">
                                        {game.speed}{bull}{(game.clock.initial / 60)} + {game.clock.increment}
                                    </Typography>
                                    <Grid className="player">
                                        <span className="dot white"/>
                                        {game.players.white.user.title ? (
                                            <div>
                                                <Typography className={classes.title} variant="overline">{game.players.white.user.title}</Typography>
                                            </div>
                                        ) : ""}
                                        <Typography variant="overline">
                                            {game.players.white.user.name}
                                        </Typography>
                                        <Typography className={classes.rating} variant="overline">
                                            ({game.players.white.rating})
                                        </Typography>
                                    </Grid>
                                    <Grid className="player">
                                        <span className="dot black"/>
                                        {game.players.black.user.title ? (
                                            <div>
                                                <Typography className={classes.title} variant="overline">{game.players.black.user.title}</Typography>
                                            </div>
                                        ) : ""}
                                        <Typography variant="overline">
                                            {game.players.black.user.name}
                                        </Typography>
                                        <Typography className={classes.rating} variant="overline">
                                            ({game.players.black.rating})
                                        </Typography>
                                    </Grid>
                                </CardContent>
                                <CardActions>
                                    <Button component={React.forwardRef((props, ref) => <Link to={`/games/${game.game_id}`} {...props} ref={ref}/>)} size="small" variant="outlined" color="primary">
                                        Zobacz
                                    </Button>
                                    <Button
                                        size="small"
                                        variant="contained"
                                        color="secondary"
                                        className={classes.button}
                                        startIcon={<DeleteIcon />}
                                        onClick={async () => {
                                            for (const comment of game.comments) {
                                                await deleteComment(game.game_id, comment._id);
                                            }
                                            deleteGame(game._id)
                                        }}
                                    >
                                        Usuń
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        games: state.games,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        fetchGames: () => {
            dispatch(gamesOperations.getGames());
        },
        addGame: (game) => {
            dispatch(gamesOperations.addGame(game))
        },
        deleteGame: (id) => {
            dispatch(gamesOperations.deleteGame(id))
        },
        deleteComment: (gameId, commentId) => {
            dispatch(commentsOperations.deleteComment(gameId, commentId))
        },
        sortByDate: (direction) => {
            dispatch(sortByDate(direction))
        },
        sortByMoves: (direction) => {
            dispatch(sortByMoves(direction))
        },
        sortByRating: (direction) => {
            dispatch(sortByRating(direction))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Games);

