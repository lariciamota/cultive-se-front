import React, { Component } from "react";
import { Header, Grid, Label, Segment, Image } from "semantic-ui-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from "recharts";

export default class Charts extends Component {
  constructor(props) {
    super(props);
    const local = true;
    this.state = {
      temperature: [],
      humidity_air: [],
      humidity_soil: [],
      luminosity: []
    };

    this.webSocket = local
      ? new WebSocket("ws://localhost:8081/public/metrics")
      : new WebSocket("ws://10.0.202.227:8081/public/metrics");

    this.updateState = this.updateState.bind(this);
    this.removeFirst = this.removeFirst.bind(this);
  }

  updateState(newData) {
    this.setState(state => {
      const temperature = state.temperature.concat(newData.temperature);
      const humidity_air = state.humidity_air.concat(newData.humidity_air);
      const humidity_soil = state.humidity_soil.concat(newData.humidity_soil);
      const luminosity = state.luminosity.concat(newData.luminosity);

      return {
        temperature,
        humidity_air,
        humidity_soil,
        luminosity
      };
    });

    if (this.state.temperature.length > 10) {
      this.removeFirst();
    }
  }

  removeFirst() {
    this.setState(state => {
      const [, ...temperature] = state.temperature;
      const [, ...humidity_air] = state.humidity_air;
      const [, ...humidity_soil] = state.humidity_soil;
      const [, ...luminosity] = state.luminosity;

      return {
        temperature,
        humidity_air,
        humidity_soil,
        luminosity
      };
    });
  }

  componentDidMount() {
    this.webSocket.onopen = function() {
      console.log("Connection open!");
      this.send("Hey server, whats up?");
    };

    const updateState = this.updateState;

    this.webSocket.onmessage = function(e) {
      updateState(JSON.parse(e.data.replace(/'/g, '"')));
    };
  }

  render() {
    function createData(array) {
      let data = [];
      array.forEach(element => {
        let newElement = { value: element };
        data.push(newElement);
      });
      console.log(data);
      return data;
    }

    return (
      <div className="Charts">
        <Header as="h1" dividing>
          <Image src="leaf.png" />
          <Header.Content>Cultive-se</Header.Content>
          <Header.Subheader>Dashboard</Header.Subheader>
        </Header>

        <Grid columns={2} padded>
          <Grid.Row>
            <Grid.Column>
              <Segment>
                <Label attached="top left">Air Humidity</Label>
                <LineChart
                  width={730}
                  height={255}
                  data={createData(this.state.humidity_air)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis label="Readings" height={55} />
                  <YAxis label="%" dataKey="value" width={90} />
                  <Tooltip />
                  <Line
                    name="air humidity"
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    isAnimationActive={false}
                  />
                </LineChart>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment>
                <Label attached="top left">Soil Humidity</Label>
                <LineChart
                  width={730}
                  height={255}
                  data={createData(this.state.humidity_soil)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis label="Readings" height={55} />
                  <YAxis label="%" dataKey="value" width={90} />
                  <Tooltip />
                  <Line
                    name="soil humidity"
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    isAnimationActive={false}
                  />
                </LineChart>
              </Segment>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column>
              <Segment>
                <Label attached="top left">Temperature</Label>
                <LineChart
                  width={730}
                  height={255}
                  data={createData(this.state.temperature)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis label="Readings" height={55} />
                  <YAxis label="ºC" dataKey="value" width={90} />
                  <Tooltip />
                  <Line
                    name="temperature"
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    isAnimationActive={false}
                  />
                </LineChart>
              </Segment>
            </Grid.Column>

            <Grid.Column>
              <Segment>
                <Label attached="top left">Luminosity</Label>
                <LineChart
                  width={730}
                  height={255}
                  data={createData(this.state.luminosity)}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis label="Readings" height={55} />
                  <YAxis label="%" dataKey="value" width={90} />
                  <Tooltip />
                  <Line
                    name="luminosity"
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    isAnimationActive={false}
                  />
                </LineChart>
              </Segment>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}
