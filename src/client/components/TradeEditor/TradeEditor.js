import React from 'react';
import PropTypes from 'prop-types';

import Paper from 'material-ui/Paper';
import { Step, Stepper, StepButton, StepLabel } from 'material-ui/Stepper';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';

import SaveIcon from 'material-ui/svg-icons/content/save';
import PreviousIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-left';
import NextIcon from 'material-ui/svg-icons/hardware/keyboard-arrow-right';
import CancelIcon from 'material-ui/svg-icons/navigation/cancel';

import Articles from '../Articles/Articles';
import PageTitle from '../../containers/PageTitle';

import './TradeEditor.css';

const STEP_IDX_PARTNER_ARTICLES = 0;
const STEP_IDX_USER_ARTICLES = 1;
const STEP_IDX_SUMMARY = 2;

const STEP_LAST_IDX = 2;

const stepButtonStyle = {fontSize: '1.25rem'};

export default class TradeEditor extends React.Component {

    constructor(props) {
        super(props);

        this.orientation = 'horizontal';
    }

    static propTypes = {
        height: PropTypes.number.isRequired,
        isCreating: PropTypes.bool.isRequired,
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
        userArticlesInfo: PropTypes.object,
        width: PropTypes.number.isRequired
    };

    static defaultProps = {
        stepIndex: 0
    };

    componentDidMount() {
        this.orientation = this.props.width <= 750 ? 'vertical' : 'horizontal';
    }

    componentWillReceiveProps(newProps) {
        if (newProps.width !== this.props.width) {
            let orientation = this.props.width <= 750 ? 'vertical' : 'horizontal';
            if (this.orientation !== orientation) {
                this.orientation = orientation;
            }
        }
    }

    // componentDidUpdate(previousProps, previousState) {
    //     if (previousProps.width !== this.props.width) {
    //         let isVertical = this.width <= 750;
    //         if (this.isVertical !== isVertical) {
    //             this.isVertical = isVertical;
    //         }
    //     }
    // }

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
                return `Du kannst einen oder mehrere Artikel auswählen, die Du von ${this.props.trade.tradePartner.name} haben möchtest.`;

            case STEP_IDX_USER_ARTICLES:
                return 'Du kannst einen oder mehrere der eigenen Artikel zum Tauschen anbieten.';

            case STEP_IDX_SUMMARY:
                return 'Hier kannst Du sehen, welche Artikel Du ausgewählt hast. Wenn alles in Ordnung ist, kannst Du deine Änderungen speichern.';

            default:
                return '';
        }
    }

    renderArticleChooser(availableArticles, chosenArticles, filterText, hasAvailableArticles, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle) {
        return (
            <div>
                <Articles
                    articles={chosenArticles}
                    title={chosenTitle}
                    emptyText="Bisher keine Artikel ausgewählt"
                    isEditing={true}
                    selected={true}
                    onToggleArticle={toggleArticle}
                    withArticleLink={false}
                />
                <Articles
                    articles={availableArticles}
                    title={availableTitle}
                    emptyText={hasAvailableArticles ? 'Keine Artikel entsprechen dem Filtertext' : 'Alle verfügbaren Artikel sind ausgewählt'}
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
                    withArticleLink={false}
                />
            </div>
        );
    }

    renderPartnerArticleChooser() {
        const { trade, partnerArticlesInfo } = this.props;
        const { visibleArticles, chosenArticles, filterText, hasAvailableArticles, pageCount, pageNum } = partnerArticlesInfo;

        let setFilterText = this.props.setFilterText.bind(this, false);
        let setPageNum = this.props.setPageNum.bind(this, false);
        let toggleArticle = this.props.toggleArticle.bind(this, false);

        let chosenTitle = trade.partnerArticlesListTitle(chosenArticles.length === 1);
        let availableTitle = `Weitere Artikel von ${trade.tradePartner.name}, die Du auswählen könntest:`;

        return this.renderArticleChooser(visibleArticles, chosenArticles, filterText, hasAvailableArticles, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle);
    }

    renderUserArticleChooser() {
        const { trade, userArticlesInfo } = this.props;
        const { visibleArticles, chosenArticles, filterText, hasAvailableArticles, pageCount, pageNum } = userArticlesInfo;

        let setFilterText = this.props.setFilterText.bind(this, true);
        let setPageNum = this.props.setPageNum.bind(this, true);
        let toggleArticle = this.props.toggleArticle.bind(this, true);

        let chosenTitle = trade.userArticlesListTitle(chosenArticles.length === 1);
        let availableTitle = `Weitere Artikel, die Du anbieten könntest:`;
        
        return this.renderArticleChooser(visibleArticles, chosenArticles, filterText, hasAvailableArticles, pageCount, pageNum, setFilterText, setPageNum, toggleArticle, chosenTitle, availableTitle);
    }

    renderSummary() {
        const { trade, partnerArticlesInfo, userArticlesInfo } = this.props;

        return (
            <div>
                <Articles articles={partnerArticlesInfo.chosenArticles} title={trade.partnerArticlesListTitle(partnerArticlesInfo.chosenArticles.length === 1)} withArticleLink={false}/>
                <Articles articles={userArticlesInfo.chosenArticles} title={trade.userArticlesListTitle(userArticlesInfo.chosenArticles.length === 1)} withArticleLink={false}/>
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
        let titleVerb = this.props.isCreating ? 'erstellen' : 'bearbeiten';
        let title = this.props.trade ? `Tauschgeschäft mit ${this.props.trade.tradePartner.name} ${titleVerb}` : `Unbekanntes Tauschgeschäft ${titleVerb}`;
        let stepTitle = this.getStepTitle();
        let stepDescription = this.getStepDescription();

        let nextButton;
        if (this.props.stepIndex === STEP_LAST_IDX) {
            nextButton = <RaisedButton label="Speichern" icon={<SaveIcon/>} secondary={true} onClick={this.props.onSave} />;
        } else {
            nextButton = <RaisedButton label="Weiter" icon={<NextIcon/>} primary={true} onClick={this.handleNext} />;
        }

        let navigation = (
            <div className="trade-editor__navigation-buttons">
                <FlatButton label="Abbrechen" icon={<CancelIcon/>} onClick={this.props.onCancel} style={{marginRight: '12px'}} />
                <FlatButton label="Zurück" icon={<PreviousIcon/>} disabled={!this.canGoToPreviousStep()} onClick={this.handlePrev} style={{marginRight: '12px'}} />
                {nextButton}
            </div>
        );

        let useLongLabel = (this.props.width <= 750) || (this.props.width > 1100);

        return (
            <div>
                <PageTitle>{title}</PageTitle>
                <Paper className="trade-editor__navigation">
                    <Stepper key={this.orientation} linear={false} activeStep={this.props.stepIndex} orientation={this.orientation}>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_PARTNER_ARTICLES)}>
                                <StepLabel style={stepButtonStyle}>{useLongLabel ? 'Gewünschte Artikel auswählen' : 'Gewünschte Artikel'}</StepLabel>
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_USER_ARTICLES)}>
                                <StepLabel style={stepButtonStyle}>{useLongLabel ? 'Artikel zum Tauschen' : 'Deine Artikel'}</StepLabel>
                            </StepButton>
                        </Step>
                        <Step>
                            <StepButton onClick={() => this.props.setStepIndex(STEP_IDX_SUMMARY)}>
                                <StepLabel style={stepButtonStyle}>Zusammenfassung</StepLabel>
                            </StepButton>
                        </Step>
                    </Stepper>
                    {navigation}
                </Paper>
                <Paper className="trade-editor__info-container">
                    <div>
                        <div className="trade-editor__step-title">{stepTitle}</div>
                        <div className="trade-editor__step-description">{stepDescription}</div>
                    </div>
                </Paper>
                <div className="trade-editor__step-container">
                    {this.renderStep()}
                </div>
            </div>
        );
    }
}
