import Joyride from 'react-joyride';
import { useTutorial } from '../../contexts/TutorialContext';
import './TutorialStyles.css';

const TutorialWrapper = () => {
  const { run, stepIndex, steps, handleJoyrideCallback } = useTutorial();

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
      hideCloseButton={false}
      spotlightClicks={false}
      scrollToFirstStep={true}
      scrollOffset={120}
      disableScrolling={false} // 🔧 CAMBIO: false para permitir scroll automático
      disableScrollParentFix={false} // 🔧 CAMBIO: false para scroll correcto
      styles={{
        options: {
          primaryColor: '#4F46E5',
          zIndex: 10000,
        },
        tooltip: {
          fontSize: 16,
          padding: 20,
        },
        buttonNext: {
          backgroundColor: '#4F46E5',
          fontSize: 14,
          padding: '10px 20px',
          borderRadius: '8px',
        },
        buttonBack: {
          color: '#4F46E5',
          fontSize: 14,
        },
        buttonSkip: {
          color: '#6B7280',
          fontSize: 14,
        },
        spotlight: {
          borderRadius: '8px',
        },
      }}
      locale={{
        back: 'Atrás',
        close: 'Cerrar',
        last: 'Finalizar',
        next: 'Siguiente',
        skip: 'Saltar tutorial',
      }}
    />
  );
};

export default TutorialWrapper;