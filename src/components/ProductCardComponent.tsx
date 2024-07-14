import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from 'react-native';
import React from 'react';
import {ProductModel} from '@/types/product';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props {
  product: ProductModel.Response.GetAll.Datum;
  onPress: TouchableOpacityProps['onPress'];
}

export const ProductCardComponent: React.FC<Props> = ({product, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.mainContainer}>
        <View style={styles.dataContainer}>
          <Text style={styles.nameText}>{product.name}</Text>
          <Text>ID: {product.id}</Text>
        </View>
        <View style={styles.iconContainer}>
          <Icon
            name="chevron-right"
            size={20}
            color="darkslategrey"
            style={styles.icon}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    padding: 14,
    gap: 5,
    flexDirection: 'row',
  },
  dataContainer: {
    flex: 1,
    gap: 4,
  },
  nameText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'darkslategrey',
  },
  iconContainer: {
    justifyContent: 'center',
  },
  icon: {
    opacity: 0.4,
  },
});
