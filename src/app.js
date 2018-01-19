import React from 'react';
import moment from 'moment';
import axios from 'axios';
import 'antd-mobile/dist/antd-mobile.css';
import { NavBar } from 'antd-mobile';

export default class App extends React.Component {
    constructor() {
        super();
        const date = moment();
        this.state = {
            date: date.format('YYYY年MM月DD日'),
            time: date.format('HH:mm'),
            whichDay: date.format('d')
        };

        this.colorMap = {
            'A早': '#CC66FF',
            'A': '#CC66CC',
            'D': '#00CCFF',
            'X': '#FF6600',
            'Y': '#CCCCCC',
            '休': '#FFB6C1'
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
                time: date.format('HH:mm'),
                whichDay: date.format('d')
            });
        }, 900);
    }

    getData() {
        const date = moment();
        const monthPicker = date.format('YYYY-MM-01');
        const index = date.format('DD') - 1;
        axios.post('https://xn--2brq06crqr.xn--6qq986b3xl/api/calendarInfo', {
            monthPicker,
            type: 'get'
        }).then(v => {
                const {status, data} = v;
                if (status === 200 && data && data.content) {
                    const dataArr = data.content.split(',');
                    this.setState({
                        today: dataArr[index],
                        tomorrow: dataArr[index + 1]
                    });
                    ;
                } else {
                    console.log(`失败： ${data.error}`);
                }
                console.log(v)
            });
    }

    getTips({today, tomorrow}) {
        const {date, time, whichDay} = this.state;
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
                        case h < 14 && h >= 11:
                            return '三点出门，还可以玩一会儿😘';
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
                        case h < 15 && h >= 11:
                            return '四点出门，还可以玩一会儿😘';
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
            const {today: _today} = this.state;
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
                    switch (true) {
                        case h > 20:
                            return '下午上班，能睡懒觉，晚睡一点没关系（是一点，太晚了打屁股😈）';
                        default:
                            return '';
                    }
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
        const {date, time, whichDay, today, tomorrow} = this.state;
        const whichDayMap = [
            '日',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六'
        ];
        return (
            <div style={{
                height: '100%',
                width: '100%',
                backgroundColor: this.colorMap[today],
                position: 'relative'
            }}>
                <div className="now">
                <NavBar
                mode="light"
                >{
                    `现在是${date} ${time} 周${whichDayMap[whichDay] || '日'}`
                }</NavBar>
                </div>
                {
                    today && (
                        <div style={{
                            textAlign: 'center',
                            fontSize: '36px',
                            width: '100%',
                            color: '#fff',
                            position: 'absolute',
                            left: '50%',
                            top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}>
                        {
                            `今天是${today}班`
                        }
                        <br />
                        <p style={{
                            fontSize: '16px',
                            textAlign: 'center',
                            marginTop: '10px'
                        }}>
                        {
                            `${this.getTips({today})}`
                        }
                        </p>
                        </div>
                    )
                }
            </div>
        );
    }
}