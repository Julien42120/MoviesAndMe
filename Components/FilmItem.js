import React from 'react';
import { StyleSheet, View, FlatList, Text, Image, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { getImageFromApi } from '../API/TMDBApi';
import FadeIn from '../Animations/FadeIn'

class FilmItem extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            positionLeft: new Animated.Value(Dimensions.get('window').width)
        }
    }

    componentDidMount() {
        Animated.spring(
            this.state.positionLeft,
            {
                toValue: 0
            }
        ).start()
    }

    _displayFavoriteImage() {
        if (this.props.isFilmFavorite) {
            // Si la props isFilmFavorite vaut true, on affiche le 🖤
            return (
                <Image
                    style={styles.favorite_image}
                    source={require('../image/ic_favorite.png')}
                />
            )
        }
    }

    render() {
        const { film, displayDetailForFilm } = this.props
        return (
            <FadeIn>
                <TouchableOpacity
                    style={styles.main_container}
                    onPress={() => displayDetailForFilm(film.id)}>
                    <Image
                        style={styles.image}
                        source={{ uri: getImageFromApi(film.poster_path) }}
                    />
                    <View style={styles.content_container}>
                        <View style={styles.header_container}>
                            {this._displayFavoriteImage()}
                            <Text style={styles.title_text}>{film.title}</Text>
                            <Text style={styles.vote_text}>{film.vote_average}</Text>
                        </View>
                        <View style={styles.description_container}>
                            <Text style={styles.description_text} numberOfLines={6}>{film.overview}</Text>
                            {/* La propriété numberOfLines permet de couper un texte si celui-ci est trop long, il suffit de définir un nombre maximum de ligne */}
                        </View>
                        <View style={styles.date_container}>
                            <Text style={styles.date_text}>Sorti le {film.release_date}</Text>
                        </View>
                    </View>
                </TouchableOpacity >
            </FadeIn>
        )
    }
}

export default FilmItem

const styles = StyleSheet.create({

    main_container: {
        height: 190,
        flexDirection: 'row'
    },
    image: {
        width: 120,
        height: 180,
        margin: 5,
        backgroundColor: 'gray'
    },
    content_container: {
        flex: 1,
        margin: 5
    },
    header_container: {
        flex: 3,
        flexDirection: 'row'
    },
    title_text: {
        fontWeight: 'bold',
        fontSize: 15,
        flex: 1,
        flexWrap: 'wrap',
        paddingRight: 5,
        color: "white"
    },
    vote_text: {
        fontWeight: 'bold',
        fontSize: 26,
        color: '#666666'
    },
    description_container: {
        flex: 7
    },
    description_text: {
        fontStyle: 'italic',
        color: '#666666'
    },
    date_container: {
        flex: 1
    },
    date_text: {
        textAlign: 'right',
        fontSize: 14
    },
    favorite_image: {
        width: 25,
        height: 25,
        marginRight: 5
    }
})
