import { Component } from 'react';

class GetJsonUpdate extends Component {
    constructor(props) {
        super(props)
        this.state = {
            x: null,
            y: null
        }
    }

    fetchJsonUpdate = () => {
        fetch(`http://127.0.0.1:8080/api/json`)
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                this.setState({ x: data.x, y: data.y })
            })
    }

    componentDidMount() {
        this.fetchJsonUpdate()
        this.timer = setInterval(
            this.fetchJsonUpdate,
            500,
        );
    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        return (
            <div>Coordinates: x -- {this.state.x}; y -- {this.state.y}</div>
        )
    }
}

export default GetJsonUpdate;