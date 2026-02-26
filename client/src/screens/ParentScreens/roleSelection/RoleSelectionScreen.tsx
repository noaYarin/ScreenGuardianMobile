import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { Text, View } from 'react-native';

import { COLORS } from '../../../../constants/theme';
import { RoleCard } from '../../../components/RoleCard/RoleCard';
import { useTranslation } from '../../../hooks/use-translation';
import { styles } from './roleselection.styles';

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
        <View style={styles.cardWrapper}>
          <RoleCard
            title={t('roleSelection.childs')}
            icon={
              <Feather
                name="smile"
                size={48}
                color={COLORS.light.icon}
              />
            }
            description={t('roleSelection.childDescription')}
            onPress={handleChildSelect}
            backgroundColor={COLORS.light.tint}
          />
        </View>

        <View style={styles.cardWrapper}>
          <RoleCard
            title={t('roleSelection.parents')}
            icon={
              <Feather
                name="user"
                size={48}
                color={COLORS.light.icon}
              />
            }
            description={t('roleSelection.parentDescription')}
            onPress={handleParentSelect}
            backgroundColor={COLORS.light.secondary}
          />
        </View>
      </View>
    </View>
  );
};

