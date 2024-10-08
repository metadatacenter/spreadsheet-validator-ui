import { useContext, useMemo } from 'react';
// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from 'chart.js/auto';
import AppContext from '../AppContext';
import PageTitle from '../../components/PageTitle';
import EvaluationSummaryChart from '../../components/EvaluationSummaryChart/evaluation-summary-chart';
import ErrorAnalysisChart from '../../components/ErrorAnalysisChart';
import Container from '../../styles/Container';
import Section from '../../styles/Section';
// eslint-disable-next-line object-curly-newline
import {
  generateErrorSummaryReport,
  generateEvaluationSummaryData,
  generateInvalidValueTypeAnalysisChartData,
  generateMissingValueAnalysisChartData,
  hasCompletenessErrors,
  hasAdherenceErrors,
  // eslint-disable-next-line object-curly-newline
} from '../../helpers/app-utils';
import { getValidationResultTitle } from '../../helpers/title-utils';

const Overview = () => {
  const { appData } = useContext(AppContext);
  const { schema, data, reporting, otherProps } = appData;
  const { inputFileMetadata } = otherProps;
  const inputFileName = inputFileMetadata.name;
  const templateName = schema.name;
  const templateAccessUrl = schema.accessUrl;

  const evaluationSummaryData = useMemo(
    () => generateEvaluationSummaryData(data, reporting),
    [reporting],
  );
  const errorSummaryData = useMemo(
    () => generateErrorSummaryReport(reporting),
    [reporting],
  );
  const missingValueAnalysisChartData = useMemo(
    () => generateMissingValueAnalysisChartData(data, errorSummaryData),
    [errorSummaryData],
  );
  const invalidValueTypeAnalysisChartData = useMemo(
    () => generateInvalidValueTypeAnalysisChartData(data, errorSummaryData),
    [errorSummaryData],
  );
  return (
    <Container>
      <Section>
        <PageTitle
          title={getValidationResultTitle()}
          subtitle={`Found ${data.length} metadata records in the spreadsheet`}
        />
      </Section>
      <Section>
        <EvaluationSummaryChart
          evaluationSummaryData={evaluationSummaryData}
          inputFileName={inputFileName}
          templateName={templateName}
          templateUrl={templateAccessUrl}
        />
      </Section>
      {hasCompletenessErrors(reporting) && (
        <Section>
          <ErrorAnalysisChart
            title="Completeness Error Analysis"
            subtitle={`Evaluating ${data.length} metadata records for detecting missing values in the spreadsheet.`}
            analysisData={missingValueAnalysisChartData}
          />
        </Section>
      )}
      {hasAdherenceErrors(reporting) && (
        <Section>
          <ErrorAnalysisChart
            title="Adherence Error Analysis"
            subtitle={`Evaluating ${data.length} metadata records for detecting invalid value types in the spreadsheet.`}
            analysisData={invalidValueTypeAnalysisChartData}
          />
        </Section>
      )}
    </Container>
  );
};

export default Overview;
