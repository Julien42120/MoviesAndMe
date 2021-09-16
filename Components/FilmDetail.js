import moment from 'moment';
import numeral from 'numeral';
import React from 'react'
import { StyleSheet, Share, View, Text, ActivityIndicator, Platform, Image } from 'react-native'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler';
import { getFilmDetailFromApi } from '../API/TMDBApi';
import { getImageFromApi } from '../API/TMDBApi';
import { connect } from 'react-redux';
import EnlargeShrink from '../Animations/EnlargeShrink';

class FilmDetail extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            film: undefined,
            isLoading: true
        }
    }

    componentDidMount() {
        const favoriteFilmIndex = this.props.favoritesFilm.findIndex(item => item.id === this.props.route.params.idFilm)
        if (favoriteFilmIndex !== -1) { // Film déjà dans nos favoris, on a déjà son détail
            // Pas besoin d'appeler l'API ici, on ajoute le détail stocké dans notre state global au state de notre component
            this.setState({
                film: this.props.favoritesFilm[favoriteFilmIndex]
            })
            return
        }
        // Le film n'est pas dans nos favoris, on n'a pas son détail
        // On appelle l'API pour récupérer son détail
        this.setState({ isLoading: true })
        getFilmDetailFromApi(this.props.route.params.idFilm).then(data => {
            this.setState({
                film: data,
                isLoading: false
            })
        })
    }

    _shareFilm() {
        const { film } = this.state
        Share.share({ title: film.title, message: film.overview + " " + getImageFromApi(film.backdrop_path) })

    }

    _displayLoadingFloatingActionButton() {
        const { film } = this.state
        if (film != undefined && Platform.OS === 'android') {
            return (

                <View style={styles.share_touchable_floatinfactionbutton}>

                    <TouchableOpacity
                        screenOptions={{
                            headerShown: false
                        }}
                        onPress={() => this._shareFilm()}
                    >
                        <Image
                            style={styles.share_image}
                            source={require('../image/ic_share.android.png')} />
                    </TouchableOpacity>
                </View>
            )
        }
    }

    _toggleFavorite() {
        const action = { type: "TOGGLE_FAVORITE", value: this.state.film }
        this.props.dispatch(action)
    }

    componentDidUpdate() {
        console.log(this.props.favoritesFilm)
    }

    _displayFavoriteImage() {
        var sourceImage = require('../image/ic_favorite_border.png');
        var shouldEnlarge = false
        if (this.props.favoritesFilm.findIndex(item => item.id === this.state.film.id) != -1) {
            sourceImage = require('../image/ic_favorite.png')
            shouldEnlarge = true
        }
        return (
            <EnlargeShrink shouldEnlarge={shouldEnlarge}>
                <Image
                    source={sourceImage}
                    style={styles.favorite_image}
                />
            </EnlargeShrink>
        )
    }

    _displayFilm() {
        console.log(film)
        const film = this.state.film
        if (film != undefined) {
            return (
                <ScrollView style={styles.scrollview_container}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.backdrop_path) }} ></Image>
                    <Text style={styles.title}>{film.title}</Text>
                    <TouchableOpacity style={styles.favorite_container} onPress={() => this._toggleFavorite()}>
                        {this._displayFavoriteImage()}
                    </TouchableOpacity>
                    <Text style={styles.overview}>{film.overview}</Text>
                    <Text style={styles.default_text}>Sorti le {moment(new Date(film.release_date)).format('DD/MM/YYYY')}</Text>
                    <Text style={styles.default_text}>Note: {film.vote_average} / 10</Text>
                    <Text style={styles.default_text}>Nombre de votes: {film.vote_count}</Text>
                    <Text style={styles.default_text}>Budget: {numeral(film.budget).format('0,0')}$</Text>
                    <Text style={styles.default_text}>Genre(s): {film.genres.map(function (genre) {
                        return genre.name;
                    }).join(" / ")} </Text>
                    <Text style={styles.default_text}>Compagnie(s): {film.production_companies.map(function (company) {
                        return company.name;
                    }).join(" / ")}</Text>
                </ScrollView>

            )
        }
    }

    _displayLoading() {
        if (this.state.isLoading) {
            return (
                <View style={styles.loading_container}>
                    <ActivityIndicator size='large' />
                </View>
            )
        }
    }

    render() {
        console.log(this.props)
        return (
            <View style={styles.main_container}>
                {this._displayFilm()}
                {this._displayLoading()}
                {this._displayLoadingFloatingActionButton()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    main_container: {
        flex: 1,
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    scrollview_container: {
        flex: 1,
        backgroundColor: 'black'
    },

    image: {
        width: "100%",
        height: 200,
        margin: 5,
        backgroundColor: 'gray'
    },
    title: {
        fontSize: 30,
        fontWeight: "bold",
        textAlign: 'center',
        marginBottom: "5%",
        color: "white"
    },
    overview: {
        fontSize: 12,
        color: "grey",
        fontStyle: 'italic',
        marginBottom: '10%'
    },
    default_text: {
        marginLeft: 5,
        marginRight: 5,
        marginTop: 5,
        color: "white"
    },

    favorite_container: {
        alignItems: 'center'
    },

    favorite_image: {
        flex: 1,
        width: null,
        height: null
    },

    share_touchable_floatinfactionbutton: {
        position: 'absolute',
        width: 60,
        height: 60,
        right: 10,
        bottom: 10,
    },

    share_image: {
        position: 'relative',
        width: 60,
        height: 60,
    }
})

const mapStateToProps = (state) => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(FilmDetail)