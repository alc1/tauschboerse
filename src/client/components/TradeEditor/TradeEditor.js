import React from 'react';
import PropTypes from 'prop-types';
import { Step, Stepper, StepButton } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import Articles from '../Articles/Articles';

import './TradeEditor.css';

const STEP_IDX_PARTNER_ARTICLES = 0;
const STEP_IDX_USER_ARTICLES = 1;
const STEP_IDX_SUMMARY = 2;

const STEP_LAST_IDX = 2;

export default class TradeEditor extends React.Component {

    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onSave: PropTypes.func.isRequired,
        partnerArticlesInfo: PropTypes.object,
        setFilterText: PropTypes.func.isRequired,
        setPageNum: PropTypes.func.isRequired,
        setStepIndex: PropTypes.func.isRequired,
        stepIndex: PropTypes.number.isRequired,
        toggleArticle: PropTypes.func.isRequired,
        trade: PropTypes.object,
        user: PropTypes.object.isRequired,
        userArticlesInfo: PropTypes.object
    };

    static defaultProps = {
        stepIndex: 0
    }

    canGoToPreviousStep = () => this.props.stepIndex > 0;

    canGotoNextStep = () => this.props.stepIndex < STEP_LAST_IDX;

    handlePrev = () => {
        if (this.canGoToPreviousStep()) {
            this.props.setStepIndex(this.props.stepIndex - 1);
        }
    };

    handleNext = () => {
        if (this.canGotoNextStep()) {
            this.props.setStepIndex(this.props.stepIndex + 1);
        }
    };

    getStepTitle() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return 'Auswahl der gewünschten Artikel';

            case STEP_IDX_USER_ARTICLES:
                return 'Auswahl der eigenen Artikel';

            case STEP_IDX_SUMMARY:
                return 'Zusammenfassung';

            default:
                return 'INFO: Unbekannter Schritt!';
        }
    }

    getStepDescription() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return `Du kannst ein oder mehrere Artikel zum Tauschen auswählen. Du kannst aber nur Artikel von ${this.props.trade.tradePartner.name} auswählen.`;

            case STEP_IDX_USER_ARTICLES:
                return 'Du kannst ein oder mehrere eigenen Artikel zum Tauschen auswählen.';

            case STEP_IDX_SUMMARY:
                return 'Hier kannst Du sehen, welche Artikel Du ausgewählt hast. Wenn alles in Ordnung ist, kannst Du Deine Änderungen speichern.';

            default:
                return '';
        }
    }

    renderArticleChooser(availableArticles, chosenArticles, filterText, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle) {
        return (
            <div>
                <Articles
                    articles={chosenArticles}
                    title={chosenTitle}
                    isEditing={true}
                    selected={true}
                    onToggleArticle={toggleArticle}
                />
                <Articles
                    articles={availableArticles}
                    title={availableTitle}
                    isEditing={true}
                    selected={false}
                    filtering={true}
                    filterText={filterText}
                    paging={true}
                    pageNum={pageNum}
                    pageCount={pageCount}
                    onFilterChange={setFilterText}
                    onPageChange={setPageNum}
                    onToggleArticle={toggleArticle}
                />
            </div>
        );
    }

    renderPartnerArticleChooser() {
        const { trade, partnerArticlesInfo } = this.props;
        const { visibleArticles, chosenArticles, filterText, pageCount, pageNum } = partnerArticlesInfo;

        let setFilterText = this.props.setFilterText.bind(this, false);
        let setPageNum = this.props.setPageNum.bind(this, false);
        let toggleArticle = this.props.toggleArticle.bind(this, false);

        let chosenTitle = trade.partnerArticlesListTitle(chosenArticles.length === 1);
        let availableTitle = `Weitere Artikel von ${trade.tradePartner.name}, die Du auswählen könntest`;

        return this.renderArticleChooser(visibleArticles, chosenArticles, filterText, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle);
    }

    renderUserArticleChooser() {
        const { trade, userArticlesInfo } = this.props;
        const { visibleArticles, chosenArticles, filterText, pageCount, pageNum } = userArticlesInfo;

        let setFilterText = this.props.setFilterText.bind(this, true);
        let setPageNum = this.props.setPageNum.bind(this, true);
        let toggleArticle = this.props.toggleArticle.bind(this, true);

        let chosenTitle = trade.userArticlesListTitle(chosenArticles.length === 1);
        let availableTitle = `Weitere Artikel, die Du anbieten könntest`;
        
        return this.renderArticleChooser(visibleArticles, chosenArticles, filterText, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle);
    }

    renderSummary() {
        const { trade, partnerArticlesInfo, userArticlesInfo } = this.props;

        return (
            <div>
                <Articles articles={partnerArticlesInfo.chosenArticles} title={trade.partnerArticlesListTitle(partnerArticlesInfo.chosenArticles.length === 1)} />
                <Articles articles={userArticlesInfo.chosenArticles} title={trade.userArticlesListTitle(userArticlesInfo.chosenArticles.length === 1)} />
            </div>
        );
    }

    renderError() {

    }

    renderStep() {
        switch(this.props.stepIndex) {
            case STEP_IDX_PARTNER_ARTICLES:
                return this.renderPartnerArticleChooser();

            case STEP_IDX_USER_ARTICLES:
                return this.renderUserArticleChooser();

            case STEP_IDX_SUMMARY:
                return this.renderSummary();

            default:
                return this.renderError();
        }
    }

    render() {
        let title = this.props.trade ? `Tauschgeschäft mit ${this.props.trade.tradePartner.name} bearbeiten` : 'Unbekanntes Tauschgeschäft bearbeiten';
        let stepTitle = this.getStepTitle();
        let stepDescription = this.getStepDescription();

        let nextButton;
        if (this.props.stepIndex === STEP_LAST_IDX) {
            nextButton = <RaisedButton label="Speichern" secondary={true} onClick={this.props.onSave} />;
        } else {
            nextButton = <RaisedButton label="Nächster Schritt" primary={true} onClick={this.handleNext} />;
        }

        let navigation = (
            <div className="trade-editor__navigation-buttons">
                <FlatButton label="Abbrechen" onClick={this.props.onCancel} style={{marginRight: '48px'}} />
                <FlatButton label="Voriger Schritt" disabled={!this.canGoToPreviousStep()} onClick={this.handlePrev} style={{marginRight: '12px'}} />
                {nextButton}
            </div>
        );

        return (
            <div>
                <div className="trade-editor__navigation">
                    <h1 className="nowrap">{title}</h1>
                    <Stepper linear={false} activeStep={this.props.stepIndex}>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_PARTNER_ARTICLES)}>
                                Gewünschte Artikel auswählen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_USER_ARTICLES)}>
                                Artikel um Tauschen
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_SUMMARY)}>
                                Zusammenfassung
                            </StepButton>
                        </Step>
                    </Stepper>
                    {navigation}
                </div>
                <div className="trade-editor__info-container">
                    <div>
                        <div>{stepTitle}</div>
                        <div>{stepDescription}</div>
                    </div>
                </div>
                <div className="trade-editor__step-container">
                    {this.renderStep()}
                </div>
            </div>
        );
    }
}
