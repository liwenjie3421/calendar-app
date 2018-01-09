import React from 'react';
import moment from 'moment';
import axios from 'axios';
import 'antd-mobile/dist/antd-mobile.css';
import { Modal, Calendar } from 'antd-mobile';

export default class App extends React.Component {
    constructor() {
        super();
        const date = moment();
        this.state = {
            date: date.format('YYYY年MM月DD日'),
            time: date.format('HH:mm'),
            dataArr: [],
            model: 1
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
                time: date.format('HH:mm')
            });
        }, 900);
    }

    componentDidMount() {
        let locked = false;
        setTimeout(() => {
            document.querySelector('body').ontouchstart = () => {
                this.start = new Date().getTime();
            }
            document.querySelector('body').ontouchend = () => {
                if (new Date().getTime() - this.start >= 380 && !locked) {
                    locked = true;
                    Modal.operation([
                        {
                            text: '查看今天',
                            onPress: () => {
                                this.setState({model: 1});
                                locked = false;
                            }
                        }, {
                            text: '查看明天',
                            onPress: () => {
                                this.setState({model: 2});
                                locked = false;
                            }
                        }, {
                            text: '查看所有',
                            onPress: () => {
                                this.setState({model: -1});
                                locked = false;
                            }
                        }
                    ])
                };
            }
        }, 200);
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
                        dataArr,
                        today: dataArr[index],
                        tomorrow: dataArr[index + 1]
                    });
                    ;
                } else {
                    console.log(`失败： ${data.error}`);
                }
            });
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
                            return '三点出门，还可以睡一会儿😘';
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
                            return '四点出门，还可以睡一会儿😘';
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

        const { today, tomorrow, model, dataArr} = this.state;
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
            <div style={{
                height: '100%',
                width: '100%',
                position: 'relative'
            }}>
                {
                    (model === 1) && today && (
                    <div style={{
                        ...styles.main,
                        backgroundColor: this.colorMap[today]
                    }}>
                        <div style={styles.work}>
                        {
                            `今天是${today}班`
                        }
                        <br />
                        <p style={styles.tips}>
                        {
                            `${this.getTips({today})}`
                        }
                        </p>
                        </div>
                    </div>
                    )
                }
                {
                    (model === 2) && tomorrow && (
                    <div style={{
                        ...styles.main,
                        backgroundColor: this.colorMap[tomorrow]
                    }}>
                        <div style={styles.work}>
                        {
                            `明天是${tomorrow}班`
                        }
                        <br />
                        <p style={styles.tips}>
                        {
                            `${this.getTips({tomorrow})}`
                        }
                        </p>
                        </div>
                    </div>
                    )
                }
                {
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
                }
            </div>
        );
    }
}