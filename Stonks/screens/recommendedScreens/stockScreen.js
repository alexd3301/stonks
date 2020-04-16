import axios from 'axios';
import React, { Component, useState, useEffect } from "react";
import { ScrollView, FlatList } from 'react-native-gesture-handler';
import {StyleSheet, Text, View, Platform, Dimensions, ActivityIndicator } from "react-native";
import Card from '../../components/Card';
import _ from 'lodash';


import {
    LineChart,
  } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const labels_=['2020-03-26','2020-03-27','2020-03-30','2020-03-31', '2020-04-01','2020-04-02', '2020-04-03'];
const formatted_labels = ['03/26','03/27','03/30','03/31', '04/01','04/02', '04/03'];

function StockPage({ route, navigation }) {
    const {ticker} = route.params;
    const [val, setVal] = useState('Time Series (Daily)');
    const [api, setApi] = useState('');
    const [open, setOpen] = useState('');
    const [high, setHigh] = useState('');
    const [close, setClose] = useState('');
    const [volume, setVolume] = useState('');
    const [weekclose, setWeekClose]=useState([]);
    const [weekmax, setWeekMax] = useState('');
    const [weekmin, setWeekMin] = useState('');
    const [results, setResults] = useState([{}]);
    const [tweets, setTweets] = useState([{}]);
    const [line, setLine] = useState({
            
        labels: ['2020-04-06','2020-04-07','2020-04-08','2020-04-09', '2020-04-13','2020-04-14', '2020-04-15'],
        datasets: [
          {
            data: [0,0,0,0,0,0,0],
            strokeWidth: 2, // optional
          },
        ],
      });
    const [loaded, SetLoaded] = useState(false);
    useEffect(() =>{
            Promise.all([fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=YJR5ZU3OSHN6F0EZ`), 
                        fetch(`http://localhost:7890/1.1/search/tweets.json?q=${ticker}`)])
        
              .then(([res1, res2]) => { 
                 return Promise.all([res1.json(), res2.json()]); 
              })
              .then(([res1, res2]) => {
                // set state in here
 
                // ALPHAVANTAGE API CALL /////////////////////////////////////////////////////////
                console.log(res1);
                setResults(res1);
                var data_api = {
                    labels: formatted_labels,
                    datasets: [
                        {
                            data: [res1["Time Series (Daily)"][labels_[0]]["4. close"], res1["Time Series (Daily)"][labels_[1]]["4. close"],res1["Time Series (Daily)"][labels_[2]]["4. close"],res1["Time Series (Daily)"][labels_[3]]["4. close"],res1["Time Series (Daily)"][labels_[4]]["4. close"],res1["Time Series (Daily)"][labels_[5]]["4. close"],res1["Time Series (Daily)"][labels_[6]]["4. close"]],
                            strokeWidth: 2,
                        }
                    ]
                }
                setLine(data_api);
                setClose(res1["Time Series (Daily)"][labels_[6]]["4. close"]);
                setOpen(res1["Time Series (Daily)"][labels_[6]]["1. open"]);
                setHigh(res1["Time Series (Daily)"][labels_[6]]["2. high"]);
                setVolume(res1["Time Series (Daily)"][labels_[6]]["5. volume"]);
                setWeekClose([Number(res1["Time Series (Daily)"][labels_[0]]["4. close"]), Number(res1["Time Series (Daily)"][labels_[1]]["4. close"]),Number(res1["Time Series (Daily)"][labels_[2]]["4. close"]),Number(res1["Time Series (Daily)"][labels_[3]]["4. close"]),Number(res1["Time Series (Daily)"][labels_[4]]["4. close"]),Number(res1["Time Series (Daily)"][labels_[5]]["4. close"]),Number(res1["Time Series (Daily)"][labels_[6]]["4. close"])]);
                setWeekMax(Math.max.apply(Math, weekclose));
                setWeekMin(Math.min.apply(Math, weekclose));
                SetLoaded(true);

                // TWITTER API CALL ///////////////////////////////////////////////////////////////////
                console.log(res2);
                let array = _.flattenDeep( Array.from(res2.data['statuses']).map((tweet) => 
                [{timePosted: tweet['created_at'], id: tweet['id'], text: tweet['text'], 
                userName: tweet['user']['name'], userScreenName: tweet['user']['screen_name'], 
                verified: tweet['user']['verified'], retweetCount: tweet['retweent_count'], 
                favoriteCount: tweet['favorite_count']}]) );
                setTweets(array);
                console.log(tweets);
              });
        // fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=YJR5ZU3OSHN6F0EZ`).then(res => res.json())
        // .then((result_) => {
        //     // Update the state of results array
        //     console.log(result_);
        //     setResults(result_);
        //     var data_api = {
        //         labels: formatted_labels,
        //         datasets: [
        //             {
        //                 data: [result_["Time Series (Daily)"][labels_[0]]["4. close"], result_["Time Series (Daily)"][labels_[1]]["4. close"],result_["Time Series (Daily)"][labels_[2]]["4. close"],result_["Time Series (Daily)"][labels_[3]]["4. close"],result_["Time Series (Daily)"][labels_[4]]["4. close"],result_["Time Series (Daily)"][labels_[5]]["4. close"],result_["Time Series (Daily)"][labels_[6]]["4. close"]],
        //                 strokeWidth: 2,
        //             }
        //         ]
        //     }
        //     setLine(data_api);
        //     setClose(result_["Time Series (Daily)"][labels_[6]]["4. close"]);
        //     setOpen(result_["Time Series (Daily)"][labels_[6]]["1. open"]);
        //     setHigh(result_["Time Series (Daily)"][labels_[6]]["2. high"]);
        //     setVolume(result_["Time Series (Daily)"][labels_[6]]["5. volume"]);
        //     setWeekClose([Number(result_["Time Series (Daily)"][labels_[0]]["4. close"]), Number(result_["Time Series (Daily)"][labels_[1]]["4. close"]),Number(result_["Time Series (Daily)"][labels_[2]]["4. close"]),Number(result_["Time Series (Daily)"][labels_[3]]["4. close"]),Number(result_["Time Series (Daily)"][labels_[4]]["4. close"]),Number(result_["Time Series (Daily)"][labels_[5]]["4. close"]),Number(result_["Time Series (Daily)"][labels_[6]]["4. close"])]);
        //     setWeekMax(Math.max.apply(Math, weekclose));
        //     setWeekMin(Math.min.apply(Math, weekclose));
        //     SetLoaded(true);
        // }).catch(error => {
        //     console.log('found error', error)
        //   });
        // fetch(`http://localhost:7890/1.1/search/tweets.json?q=${ticker}`).then(res => res.json())
        // .then((result_) => {
        //     // Update the state of results array
        //     let array = _.flattenDeep( Array.from(result_.data['statuses']).map((tweet) => 
        //     [{timePosted: tweet['created_at'], id: tweet['id'], text: tweet['text'], 
        //     userName: tweet['user']['name'], userScreenName: tweet['user']['screen_name'], 
        //     verified: tweet['user']['verified'], retweetCount: tweet['retweent_count'], 
        //     favoriteCount: tweet['favorite_count']}]) );
        //     setTweets(array);
        //     console.log(tweets);
        // }).catch(error => {
        //     console.log('found error', error)
        //   });
    }
    );

    if (!loaded){
        return (
            <View>
                <ActivityIndicator size="large" color="#1A741D" />
            </View>
            
        );
    }else{
        return (
            <ScrollView>
                    <Text style={styles_stock.titleText}>
                        {ticker}
                    </Text>
                    <Text style={styles_stock.titleText2}>
                        Close: {close}
                    </Text>
                    <Text style={styles_stock.titleText2}>
                        Open: {open}
                    </Text>
                    <Text style={styles_stock.titleText2}>
                    </Text>
                    <Text style={styles_stock.titleText2}>
                        Past Week:
                    </Text>
                    <LineChart
                        data={line}
                        width={Dimensions.get('window').width} // from react-native
                        height={220}
                        yAxisLabel={'$'}
                        chartConfig={{
                        backgroundColor: '#e26a00',
                        backgroundGradientFrom: '#fb8c00',
                        backgroundGradientTo: '#ffa726',
                        decimalPlaces: 2, // optional, defaults to 2dp
                        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                        style: {
                            borderRadius: 16
                        }
                        }}
                        bezier
                        style={{
                        marginVertical: 8,
                        borderRadius: 16
                        }}
                    />
                    <Text style={styles_stock.titleText2_}></Text>
                    <Text style={styles_stock.titleText3}>
                        Key Information [{formatted_labels[6]}]:
                    </Text>
                    <Text style={styles_stock.titleText2}>
                    </Text>
                    
                    <Text style={styles_stock.titleText2_}>
                        Volume: {Number(volume).toLocaleString(navigator.language, { minimumFractionDigits: 0 })}
                    </Text>
                    <FlatList
                        data={tweets}
                        renderItem={({ item }) => <Card username={item.userName} text={item.text}/>}
                        keyExtractor={item => item['id']}
                    />
                </ScrollView>
        );
    }
    
    
} export default StockPage

var styles_stock = StyleSheet.create({
    titleText: {
      fontSize: 50,
      fontWeight: 'bold',
      textAlign: "left",
      color:'#1A741D'
    },
    titleText2: {
      fontSize: 25,
      fontWeight: 'bold',
    },
    titleText2_: {
        fontSize: 25,
        //fontWeight: 'bold',
        fontStyle: 'italic'
      },
    titleText3: {
        fontSize: 30,
        fontWeight: 'bold',
        color:'#1A741D'
      },
    homePage: {
      backgroundColor: '#fafafa'              
    }
  })

