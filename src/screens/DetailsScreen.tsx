import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@navigation/HomeStackNavigator';
import {ProductModel} from '@types/product';
import {productService} from '@services/product';
import Icon from 'react-native-vector-icons/FontAwesome';
import {BottomSheetView, BottomSheetModal} from '@gorhom/bottom-sheet';

interface Props extends NativeStackScreenProps<HomeStackParamList, 'Details'> {}

export const DetailsScreen: React.FC<Props> = ({route, navigation}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const [product, setProduct] = useState<ProductModel.Response.GetOne | null>(
    null,
  );

  const bottomSheetModalRef = React.useRef<BottomSheetModal>(null);

  const snapPoints = React.useMemo(() => ['50%'], []);

  const handlePresentModalPress = () => {
    bottomSheetModalRef.current?.present();
  };

  useEffect(() => {
    setIsLoading(true);

    productService
      .getOne(route.params.id)
      .then(({data}) => setProduct(data))
      .catch(error => {
        Alert.alert(
          'Error',
          error.message ?? 'Ocurrió un error al obtener el producto',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleDelete = () => {
    if (!product) {
      return;
    }

    bottomSheetModalRef.current?.dismiss();

    setIsDeleting(true);

    productService
      .remove(product.id)
      .then(({data}) => {
        Alert.alert(
          'Éxito',
          data.message ?? 'Producto eliminado correctamente',
        );

        navigation.popToTop();
        navigation.replace('Home');
      })
      .catch(error => {
        Alert.alert(
          'Error',
          error.message ?? 'Ocurrió un error al eliminar el producto',
        );
      })
      .finally(() => setIsDeleting(false));
  };

  return isLoading ? (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="gold" />
    </View>
  ) : (
    product && (
      <View style={styles.screen}>
        <View style={styles.dataContainer}>
          <Image
            source={{uri: product.logo}}
            style={{width: 'auto', height: 200, resizeMode: 'contain'}}
          />
          <Text style={styles.idText}>ID: {product.id}</Text>
          <Text style={styles.subtitle}>Información adicional</Text>
          <Text style={styles.dataText}>
            <Text style={styles.keyText}>Nombre: </Text>
            {product.name}
          </Text>
          <Text style={styles.dataText}>
            <Text style={styles.keyText}>Descripción: </Text>
            {product.description}
          </Text>
          <Text style={styles.dataText}>
            <Text style={styles.keyText}>Fecha de liberación: </Text>
            {product.date_release}
          </Text>
          <Text style={styles.dataText}>
            <Text style={styles.keyText}>Fecha de revisión: </Text>
            {product.date_revision}
          </Text>
        </View>
        <View style={styles.buttonsContainer}>
          <FilledButtonComponent
            text="Editar"
            onPress={() => navigation.push('Form', {id: product.id})}>
            <Icon name="edit" size={18} color="darkslategrey" />
          </FilledButtonComponent>
          <OutlinedButtonComponent
            text="Eliminar"
            onPress={handlePresentModalPress}
            // onPress={handleDelete}
            isLoading={isDeleting}>
            <Icon name="trash" size={18} color="darkslategrey" />
          </OutlinedButtonComponent>
        </View>

        <BottomSheetModal
          ref={bottomSheetModalRef}
          index={0}
          snapPoints={snapPoints}>
          <BottomSheetView style={styles.sheetContentContainer}>
            <Text
              style={{
                textAlign: 'center',
                fontWeight: 'bold',
                fontSize: 18,
                color: 'darkslategrey',
              }}>
              ¿Estás seguro de eliminar el producto {product.name}?
            </Text>

            <View style={styles.buttonsContainer}>
              <FilledButtonComponent text="Confirmar" onPress={handleDelete}>
                <Icon name="check" size={18} color="darkslategrey" />
              </FilledButtonComponent>

              <OutlinedButtonComponent
                text="Cancelar"
                onPress={() => bottomSheetModalRef.current?.dismiss()}>
                <Icon name="remove" size={18} color="darkslategrey" />
              </OutlinedButtonComponent>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </View>
    )
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 22,
    backgroundColor: 'white',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  idText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'darkslategrey',
    textAlign: 'center',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'semibold',
    color: 'darkslategrey',
    marginTop: 16,
    marginBottom: 8,
  },
  dataText: {
    fontSize: 16,
    color: 'darkslategrey',
    marginTop: 4,
  },
  keyText: {
    fontWeight: 'bold',
    color: 'darkslategrey',
  },
  dataContainer: {
    flex: 1,
  },
  buttonsContainer: {
    marginTop: 24,
    gap: 12,
  },
  sheetContentContainer: {
    flex: 1,
    padding: 22,
  },
});
