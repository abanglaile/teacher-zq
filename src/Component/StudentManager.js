import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import *as action from '../Action/';
import { List, Avatar, Icon, Card, Input, Button, Table, Popover } from 'antd'
import Highlighter from 'react-highlight-words';
const { Meta } = Card;
const { Search } = Input;

class StudentCenter extends React.Component{
    constructor(props){
        super();
        this.state = {
            searchText: '', filtered: false, 
        };
    }

    componentDidMount(){
        const { teacher_id } = this.props;
        this.props.getStudentList(teacher_id);
    }

    handleSearch(selectedKeys, confirm){
		confirm();
		this.setState({ searchText: selectedKeys[0] });
    }
    
    handleReset(clearFilters){
        clearFilters();
        this.setState({ searchText: '' });
    }

    render(){
    var { student_list } = this.props;

    this.columns = [{
        title: '头像',
        dataIndex: 'avatar',
        width: '15%',
        render: (text, record, index) => {
            return(
                // <Avatar src={text} />
                <div>
                    <Popover content={this.props.code} title="邀请码" trigger="click">
                        <a onClick={() => this.props.getCodeByStudentid(record.student_id)}>
                            <Avatar src={text} />
                        </a>
                    </Popover>
                </div>
            );
        },
    },  {
        title: '姓名',
        dataIndex: 'realname',
        width: '15%',
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
            <div style={{ padding: 8 }}>
              <Input
                ref={ele => this.searchInput = ele}
                placeholder="输入关键字"
                value={selectedKeys[0]}
                onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
                style={{ width: 188, marginBottom: 8, display: 'block' }}
              />
              <Button
                type="primary"
                onClick={() => this.handleSearch(selectedKeys, confirm)}
                icon="search"
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Search
              </Button>
              <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                Reset
              </Button>
            </div>
        ),
        filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#108ee9' : '#aaa' }} />,
        onFilter: (value, record) => {
            var indexs = record.realname.indexOf(value);
            return (indexs >= 0 ? true : false);
        },
        onFilterDropdownVisibleChange: (visible) => {
            if (visible) {
                setTimeout(() => {this.searchInput.focus();});
            }
        },
        render: (text, record, index) => {
            let urlstr = "/teacher-zq/student_info/"+record.student_id;
            return(
                <div>
                    <Link to={urlstr}>
                        <Highlighter
                            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                            searchWords={[this.state.searchText]}
                            autoEscape
                            textToHighlight={text.toString()}
                        />
                    </Link>
                </div>
            );
        },
    },{
        title: '参与课程',
        dataIndex: 'group_info',
        width: '70%',
        render: (text, record, index) => {
            return(
                <div>
                    {text.map(item => (
                        <span style={{marginRight:'2rem'}}>
                            {item.group_name}
                        </span>
                    ))}
                </div>
            );
        },
    }];
    
      return( 
        <div>
            < Table 
                columns = { this.columns } 
                dataSource = { student_list }
            /> 
        </div>   
        );
    }
}

export default connect(state => {
    const class_data = state.classGroupData.toJS();
    return {
        student_list : class_data.student_list,
        code : class_data.code,
        teacher_id: state.AuthData.get('userid'),
    }
}, action)(StudentCenter);