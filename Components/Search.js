import React from 'react';
import { StyleSheet, Button, TextInput, View, FlatList, Text, ActivityIndicator, Image, Pressable, SafeAreaView } from 'react-native';
import FilmItem from './FilmItem';
import { getFilmsFromApiWithSearchedText } from '../API/TMDBApi';
import { connect } from 'react-redux'
import FilmList from './FilmList';

class Search extends React.Component {
    constructor(props) {
        super(props)
        this.page = 0
        this.totalPages = 0
        this.searchedText = ""
        this.state = {
            films: [],
            isLoading: false
        }
        this._loadFilms = this._loadFilms.bind(this)
    }

    _loadFilms() {
        if (this.searchedText.length > 0) {
            this.setState({ isLoading: true })
            getFilmsFromApiWithSearchedText(this.searchedText, this.page + 1).then(data => {
                this.page = data.page
                this.totalPages = data.total_pages
                this.setState({
                    films: [...this.state.films, ...data.results],
                    isLoading: false
                })
            })
        }
    }

    _searchTextInputChanged(text) {
        this.searchedText = text
    }

    _searchFilms() {
        this.page = 0,
            this.totalPages = 0,
            this.setState({
                films: []
            }, () => {
                this._loadFilms()
            })
    }

    _displayDetailForFilm = (idFilm) => {
        console.log("Display film with id " + idFilm)
        this.props.navigation.navigate("FilmDetail", { idFilm: idFilm })
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
        console.log(this.searchedText);

        if (this.searchedText == "") {
            return (
                <SafeAreaView style={styles.main_container}>
                    <View style={styles.main_container}>
                        <TextInput
                            onSubmitEditing={() => this._loadFilms()}
                            onChangeText={(text) => this._searchTextInputChanged(text)}
                            onSubmitEditing={() => this._searchFilms()}
                            style={styles.Textinput} placeholder="Titre du film" />
                        <Pressable
                            style={styles.button}
                            onPress={() => this._searchFilms()}>
                            <Text style={styles.text}>Rechercher</Text>
                        </Pressable>
                        <Image style={styles.image}
                            source={require("../image/MoviesAndMe.jpg")}></Image>
                    </View>
                </SafeAreaView>
            )
        } else {
            return (
                <SafeAreaView style={styles.main_container}>
                    <View style={styles.main_container}>
                        <TextInput
                            style={styles.textinput}
                            placeholder='Titre du film'
                            onSubmitEditing={() => this._loadFilms()}
                            onChangeText={(text) => this._searchTextInputChanged(text)}
                            onSubmitEditing={() => this._searchFilms()}
                        />
                        <Button title='Rechercher' onPress={() => this._searchFilms()} />
                        <FilmList
                            films={this.state.films} // C'est bien le component Search qui récupère les films depuis l'API et on les transmet ici pour que le component FilmList les affiche
                            navigation={this.props.navigation} // Ici on transmet les informations de navigation pour permettre au component FilmList de naviguer vers le détail d'un film
                            loadFilms={this._loadFilms} // _loadFilm charge les films suivants, ça concerne l'API, le component FilmList va juste appeler cette méthode quand l'utilisateur aura parcouru tous les films et c'est le component Search qui lui fournira les films suivants
                            page={this.page}
                            totalPages={this.totalPages} // les infos page et totalPages vont être utile, côté component FilmList, pour ne pas déclencher l'évènement pour charger plus de film si on a atteint la dernière page
                            favoriteList={false}
                        />
                        {this._displayLoading()}
                    </View>
                </SafeAreaView>
            )
        }

    }
}

const styles = StyleSheet.create({
    Textinput: {
        marginTop: 10,
        marginLeft: 5,
        marginRight: 5,
        height: 50,
        borderColor: '#000000',
        borderWidth: 1,
        paddingLeft: 5,
        backgroundColor: "grey",
    },

    main_container: {
        flex: 1,
        backgroundColor: "black"
    },

    loading_container: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 100,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center'
    },

    image: {
        marginTop: 100,
        width: "100%",
        height: 400,
        margin: 5,
        backgroundColor: 'gray'
    },

    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 4,
        elevation: 3,
        backgroundColor: 'black',
        borderWidth: 1,
        borderColor: "white"
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
})

// On connecte le store Redux, ainsi que les films favoris du state de notre application, à notre component Search
const mapStateToProps = state => {
    return {
        favoritesFilm: state.favoritesFilm
    }
}

export default connect(mapStateToProps)(Search)