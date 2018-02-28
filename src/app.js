import React from 'react';
import moment from 'moment';
import axios from 'axios';
import Modal from 'antd-mobile/lib/modal/index';
import Calendar from 'antd-mobile/lib/calendar/index';
import Swiper from 'swiper';
import 'antd-mobile/lib/modal/style/css';
import 'antd-mobile/lib/calendar/style/css';
import 'swiper/dist/css/swiper.min.css';

import {domain} from './config';

export default class App extends React.Component {
    constructor() {
        super();
        const date = moment();
        this.state = {
            date: date.format('YYYY年MM月DD日'),
            time: date.format('HH:mm'),
            dataArr: [],
            nextDataArr: []
        };

        this.colorMap = {
            'A早': '#CC66FF',
            'A': '#CC66CC',
            'D': '#00CCFF',
            'X': '#FF6600',
            'Y': '#CCCCCC',
            '休': '#FFB6C1',
            'C': '#00CCFF',
            'E': '#999999'
        };
    }

    componentWillMount() {
        let d = moment().format('DD');
        this.getData();
        setInterval(() => {
            const date = moment();
            if(date.format('DD') > d) {
                d = date.format('DD');
                this.getData();
            }
            this.setState({
                date: date.format('YYYY年MM月DD日'),
                time: date.format('HH:mm')
            });
        }, 900);
    }

    componentDidMount() {
        setTimeout(() => {
            new Swiper('.swiper-container', {
                    direction: 'horizontal',
                    loop: false
                  });
        }, 1200);
    }
    
    async getData() {
        const date = moment();
        const monthPicker = date.format('YYYY-MM-01');
        const nextMonthPicker = date.add(1, 'month').format('YYYY-MM-01');
        const daysNum = date.daysInMonth();
        
        const allData = await Promise.all(
            [await axios.post(`${domain}/calendarInfo`, {
                monthPicker,
                type: 'get'
            }),
            await axios.post(`${domain}/calendarInfo`, {
                monthPicker: nextMonthPicker,
                type: 'get'
            })]
        );
        const {status, data} = allData[0];
        if (status === 200 && data && data.content) {
            const {info, tutorMap} = data.content;
            const dataArr = info.map(item => {
                return {
                    tutor: tutorMap[item.color],
                    item: item.item
                };
            });
            this.setState({
                dataArr
            });
        } else {
            console.log(`失败： ${data.error}`);
        }
        const {status: nextStatus, data: nextData} = allData[1];
        if (nextStatus === 200 && nextData && nextData.content) {
            const {info, tutorMap} = nextData.content;
            const nextDataArr = info.map(item => {
                return {
                    tutor: tutorMap[item.color],
                    item: item.item
                };
            });
            this.setState({
                nextDataArr
            });
        } else {
            console.log(`失败： ${nextData.error}`);
        }
    }

    getTips({today, tomorrow}) {
        const {time} = this.state;
        const h = time.split(':')[0];
        if (today) {
            const tipsMap = {
                'A早': (()=>{
                    switch (true) {
                        case h > 15:
                            return '今天起早了，早点休息哦(⊙o⊙)';
                        default:
                            return '';
                    }
                })(),
                'A': (()=>{
                    switch (true) {
                        case h > 16:
                            return '今天起早了，早点休息哦(⊙o⊙)';
                        default:
                            return '';
                    }
                })(),
                'D': (()=>{
                    switch (true) {
                        case h < 5:
                            return '下午上班，能睡懒觉，晚睡一点没关系（是一点，太晚了打屁股😈）';
                        case h < 14:
                            return '两点出门，还可以睡一会儿😘';
                        case h < 15 && h >= 14:
                            return '快要上班了，赶快出门╭ (′ ▽ `)╯';
                        case h > 23:
                            return '下班注意安全，到家call me ☏';
                        default:
                            return '';
                    }
                })(),
                'X': (()=>{
                    switch (true) {
                        case h < 5:
                            return '下午上班，能睡懒觉，晚睡一点没关系（是一点，太晚了打屁股😈）';
                        case h < 15:
                            return '三点出门，还可以睡一会儿😘';
                        case h < 16 && h >= 15:
                            return '快要上班了，赶快出门╭ (′ ▽ `)╯';
                        case h > 23:
                            return '下班注意安全，到家call me ☏';
                        default:
                            return '';
                    }
                })(),
                'Y': (()=>{
                    switch (true) {
                        case h < 22:
                            return '今天要熬大夜，多睡觉，多睡觉，多睡觉（－－）';
                        default:
                            return '';
                    }
                })(),
                '休': (()=>{
                    return '今天休息，尽情放纵吧(ˇˍˇ) ';
                })()
            };
            return tipsMap[today] || '';
        } else if (tomorrow) {
            const tipsMap = {
                'A早': (()=>{
                    switch (true) {
                        case h > 20:
                            return '明天要早起，早点休息哦(⊙o⊙)';
                        default:
                            return '';
                    }
                })(),
                'A': (()=>{
                    switch (true) {
                        case h > 20:
                            return '明天要早起，早点休息哦(⊙o⊙)';
                        default:
                            return '';
                    }
                })(),
                'D': (()=>{
                    switch (true) {
                        case h > 20:
                            return '下午上班，能睡懒觉，晚睡一点没关系（是一点，太晚了打屁股😈）';
                        default:
                            return '';
                    }
                })(),
                'X': (()=>{
                        return '下午上班，能睡懒觉，晚睡一点没关系（是一点，太晚了打屁股😈）';
                })(),
                'Y': (()=>{
                    switch (true) {
                        case h < 22:
                            return '明天要熬大夜，多睡觉，多睡觉，多睡觉（－－）';
                        default:
                            return '';
                    }
                })(),
                '休': (()=>{
                    return '明天休息，尽情放纵吧(ˇˍˇ) ';
                })()
            };
            return tipsMap[tomorrow] || '';
        }
        return '';
    }

    render() {
        const date = moment();
        const index = date.format('DD') - 1;
        const {dataArr, nextDataArr} = this.state;
        const today = dataArr[index];
        const daysNum = date.daysInMonth();
        let tomorrow = {};
        if (daysNum === index + 1) { //月末
            tomorrow = nextDataArr[0];
        } else {
            tomorrow = dataArr[index + 1];
        }
        const styles = {
            main: {
                height: '100%',
                width: '100%',
                // backgroundColor: this.colorMap[today],
                position: 'relative'
            },
            work: {
                textAlign: 'center',
                fontSize: '36px',
                width: '100%',
                color: '#fff',
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)'
            },
            tips: {
                fontSize: '16px',
                textAlign: 'center',
                marginTop: '10px',
                lineHeight: '20px'
            }
        };
        return (
            <div className="swiper-container" style={{
                height: '100%',
                width: '100%',
                position: 'relative'
            }}>
                <div className="swiper-wrapper">
                    {
                        today && (
                            <div className="swiper-slide" style={{
                                ...styles.main,
                                backgroundColor: this.colorMap[today.item]
                            }}>
                                <div style={styles.work}>
                                {
                                    `今天是${today.item}班`
                                }
                                <br />
                                <p style={styles.tips}>
                                {
                                    `${this.getTips({today: today.item})}`
                                }
                                </p>
                                </div>
                            </div>
                            )
                    }
                    {
                        tomorrow && (
                            <div className="swiper-slide" style={{
                                ...styles.main,
                                backgroundColor: this.colorMap[tomorrow.item]
                            }}>
                                <div style={styles.work}>
                                {
                                    `明天是${tomorrow.item}班`
                                }
                                <br />
                                <p style={styles.tips}>
                                {
                                    `${this.getTips({tomorrow: tomorrow.item})}`
                                }
                                </p>
                                </div>
                            </div>
                            )
                    }
                </div>
                {/* {
                    (model === -1) && dataArr && dataArr.length && (
                        <div>
                            <Calendar
                                onCancel={()=>this.setState({model: 1})}
                                visible={true}
                                // onConfirm={this.onConfirm}
                                // onSelectHasDisableDate={this.onSelectHasDisableDate}
                                getDateExtra={(date) => {return { info: dataArr[date.getDate() - 1] }}}
                                defaultDate={new Date()}
                                type='one'
                                minDate={new Date(+new Date())}
                                maxDate={new Date(+new Date())}
                                />
                        </div>
                    )
                } */}
            </div>
        );
    }
}