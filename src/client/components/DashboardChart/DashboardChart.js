import React from 'react';
import PropTypes from 'prop-types';
import { PieChart, Pie, Legend, Tooltip } from 'recharts';

import Paper from 'material-ui/Paper';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

import Placeholder from '../../containers/Placeholder';

import './DashboardChart.css';

const toolbarStyle = { width: '100%' };
const toolbarTitleStyle = { color: 'black' };

export default class DashboardChart extends React.Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        data: PropTypes.array.isRequired,
        placeholderText: PropTypes.string.isRequired,
        placeholderLoadingText: PropTypes.string.isRequired,
        loading: PropTypes.bool.isRequired
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.data.length !== this.props.data.length) {
            return true;
        }
        for (let index = 0; index < nextProps.data.length; index++) {
            if (nextProps.data[index].name !== this.props.data[index].name
                || nextProps.data[index].value !== this.props.data[index].value
                || nextProps.data[index].fill !== this.props.data[index].fill) {
                return true;
            }
        }
        return false;
    }

    render() {
        const { title, data, placeholderText, placeholderLoadingText, loading } = this.props;
        const countAll = data.reduce((sum, item) => sum + item.value, 0);

        return (
            <section className="dashboard-chart">
                <Paper className="dashboard-chart__container">
                    <Toolbar style={toolbarStyle}>
                        <ToolbarGroup>
                            <ToolbarTitle style={toolbarTitleStyle} text={`${title} (${countAll})`}/>
                        </ToolbarGroup>
                    </Toolbar>
                    {countAll > 0 ? (
                        <PieChart width={450} height={400}>
                            <Pie dataKey="value" data={data} innerRadius={20} outerRadius={120} isAnimationActive label/>
                            <Tooltip/>
                            <Legend/>
                        </PieChart>
                    ) : (
                        <Placeholder width={450} height={343} loading={loading} text={placeholderText} loadingText={placeholderLoadingText}/>
                    )}
                </Paper>
            </section>
        );
    }
}
