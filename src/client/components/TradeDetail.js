import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import ArticleList from './ArticleList';

import './TradeDetail.css';

class TradeDetail extends React.Component {

    static propTypes = {
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
    };

    static defaultProps = {
        trade: null
    };

    // constructor(props) {
    //     super(props);
    // }

    generateContentForNewTrade() {
        return (
            <div>
                <section>
                    <div>Du möchtest folgende Artikel von {this.props.trade.tradePartner.name}:</div>
                    <ArticleList articles={this.props.trade.tradePartnerArticles} />
                </section>
                <section>
                    <div>Du bietest dafür folgende Artikel an:</div>
                    <ArticleList articles={this.props.trade.userArticles} />
                </section>
                <section>
                    <div><button type="button">Angebot machen</button></div>
                </section>
            </div>
        );
    }
    
    generateContentForMadeOffer() {
        return (
            <div>
                <section>
                    <div>Du möchtest folgende Artikel von {this.props.trade.tradePartner.name}:</div>
                    <ArticleList articles={this.props.trade.tradePartnerArticles} />
                </section>
                <section>
                    <div>Du hast dafür folgende Artikel angeboten:</div>
                    <ArticleList articles={this.props.trade.userArticles} />
                </section>
                <section>
                    <div>{this.props.trade.tradePartner.name} hat sich noch nicht entschieden</div>
                    <div><button type="button">Angebot zurückziehen</button></div>
                </section>
            </div>
        );
    }

    generateContentForReceivedOffer() {
        return (
            <div>
                <section>
                    <div>{this.props.trade.tradePartner.name} möchte folgende Artikel von Dir:</div>
                    <ArticleList articles={this.props.trade.tradePartnerArticles} />
                </section>
                <section>
                    <div>Dafür bietet er/sie Dir folgende Artikel an:</div>
                    <ArticleList articles={this.props.trade.userArticles} />
                </section>
                <section>
                    <div>
                        <button type="button">Angebot annehmen</button>
                        <button type="button">Angebot ablehnen</button>
                        <button type="button">Gegenangebot machen</button>
                    </div>
                </section>
            </div>
        );
    }

    generateContentForUnforeseenState() {
        return (
            <div>Das Tauschgeschäft ist in einem unvorhergesehenen Zustand geraten - die Entwickler müssen wieder 'ran!</div>
        );
    }

    render() {
        let title = this.props.trade ? <h1>Tauschgeschäft mit {this.props.trade.tradePartner.name}</h1> : <h1>Unbekanntes Tauschgescäft</h1>;
        let content = null;
        if (this.props.trade.isNew) {
            content = this.generateContentForNewTrade();
        } else if (this.props.trade.hasMadeCurrentOffer) {
            content = this.generateContentForMadeOffer();
        } else if (this.props.trade.requiresInputFromUser) {
            content = this.generateContentForReceivedOffer();
        } else {
            content = this.generateContentForUnforeseenState();
        }

        return (
            <div>
                {title}
                {content}
            </div>
        );
    }
}

export default TradeDetail;