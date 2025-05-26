import OnboardingLayout from '@/components/OnboardingLayout';
import { useLocalSearchParams, useRouter } from 'expo-router';

type StepParams = {
  step?: string | string[];
};

const data = [
  {
    title: 'We are into automating Microfinance in Pakistan',
    image: require('@/assets/images/wallet.png'),
  },
  {
    title: 'Instapay is a Microfinance business Software',
    image: require('@/assets/images/network.png'),
  },
];

export default function OnboardingStep() {
  const router = useRouter();
  const params = useLocalSearchParams() as StepParams;

  const stepParam = Array.isArray(params.step) ? params.step[0] : params.step;
  const index = parseInt(stepParam || '0', 10);
  
  const goNext = () => {
    if (index + 1 < data.length) {
      router.push({
        pathname: '/onboarding/[step]',
        params: { step: `${index + 1}` },
      });
    } else {
      router.replace('/login'); // or your main screen
    }
  };
  

  // Handle out-of-bounds index safely
  if (index < 0 || index >= data.length) {
    return null;
  }

  return (
    <OnboardingLayout
      image={data[index].image}
      title={data[index].title}
      index={index}
      total={data.length}
      onNext={goNext}
    />
  );
}
