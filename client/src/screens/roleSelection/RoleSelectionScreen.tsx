import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { RoleCard } from '../../components/RoleCard/RoleCard';
import { useTranslation } from '../../../hooks/use-translation';
import { styles } from './roleselection.styles';
import { APP_COLORS, COLORS } from '../../../constants/theme';

export const RoleSelectionScreen: React.FC = () => {
  const router = useRouter();
  const { t } = useTranslation();

  const title = t('roleSelection.title');

  const handleParentSelect = () => {
    router.push('/parentAuth' as any);
  };

  const handleChildSelect = () => {
    router.push('/childLink' as any);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>

      <View style={styles.cardsContainer}>
          <RoleCard
            title={t('roleSelection.childs')}
            imageSource={require('../../../assets/images/childrens.webp')}
            description={t('roleSelection.childDescription')}
            onPress={handleChildSelect}
            backgroundColor={APP_COLORS.beige}
            avatarCircleBackground={COLORS.light.tint}
          />

          <RoleCard
            title={t('roleSelection.parents')}
            imageSource={require('../../../assets/images/parents.webp')}
            description={t('roleSelection.parentDescription')}
            onPress={handleParentSelect}
            backgroundColor={COLORS.light.tint}
            avatarCircleBackground={APP_COLORS.beige}
          />
      </View>
    </View>
  );
};

