import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '@/navigation/index';
import {productService} from '@/services/index';
import {ProductModel} from '@/types/product';
import {FilledButtonComponent, ProductCardComponent} from '@/components/index';
import Icon from 'react-native-vector-icons/FontAwesome';

interface Props extends NativeStackScreenProps<HomeStackParamList, 'Home'> {}

export const HomeScreen: React.FC<Props> = ({navigation}) => {
  const [searchText, setSearchText] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [timeoutToClear, setTimeoutToClear] = useState<NodeJS.Timeout>();
  const allProducts = useRef<ProductModel.Response.GetAll.Datum[]>([]);

  const [products, setProducts] = useState<
    ProductModel.Response.GetAll.Datum[]
  >([]);

  useEffect(() => {
    return () => {
      clearTimeout(timeoutToClear);
    };
  }, []);

  const debounce = (
    callback: Function,
    alwaysCall: Function,
    delay: number,
  ) => {
    return (...args: any) => {
      alwaysCall(...args);
      clearTimeout(timeoutToClear);

      setTimeoutToClear(
        setTimeout(() => {
          callback(...args);
        }, delay),
      );
    };
  };

  const setSearchTextAlways = (text: string) => {
    setSearchText(text);
  };

  const searchProducts = (text: string) => {
    const filteredProducts = allProducts.current.filter(product =>
      product.name.toLowerCase().includes(text.toLowerCase()),
    );

    setProducts(filteredProducts);
  };

  const handleSearch = debounce(searchProducts, setSearchTextAlways, 300);

  useEffect(() => {
    setIsLoading(true);

    productService
      .getAll()
      .then(({data: {data}}) => {
        allProducts.current = data;
        setProducts(data);
      })
      .catch(error => {
        Alert.alert(
          'Error',
          error.message ?? 'Ocurrió un error al obtener los productos',
        );
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <View style={styles.screen}>
      <TextInput
        style={styles.searchInput}
        value={searchText}
        onChangeText={handleSearch}
        placeholder="Buscar..."
      />

      <Text style={styles.amountText}>
        {products.length}{' '}
        {products.length === 0 || products.length > 1
          ? 'resultados'
          : 'resultado'}
      </Text>

      {isLoading ? (
        <View style={styles.spinnerContainer}>
          <ActivityIndicator size="large" color="gold" />
        </View>
      ) : (
        <FlatList
          contentContainerStyle={styles.listContentContainer}
          data={products}
          renderItem={({item}) => (
            <ProductCardComponent
              product={item}
              onPress={() => navigation.push('Details', {id: item.id})}
            />
          )}
          style={styles.productList}
          ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
          keyExtractor={item => item.id}
          ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <Icon
                name="exclamation-triangle"
                size={32}
                color="darkslategrey"
              />
              <Text style={styles.emptyText}>No se encontraron productos</Text>
            </View>
          )}
        />
      )}

      <View style={styles.buttonContainer}>
        <FilledButtonComponent
          text="Agregar"
          onPress={() => navigation.push('Form')}>
          <Icon name="plus" size={18} color="darkslategrey" />
        </FilledButtonComponent>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 22,
    backgroundColor: 'white',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: 'darkslategrey',
    borderRadius: 8,
    padding: 8,
  },
  spinnerContainer: {
    marginTop: 16,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productList: {
    marginTop: 8,
    flex: 1,
  },
  listContentContainer: {
    borderWidth: 1,
    borderColor: 'lightgrey',
    borderRadius: 8,
  },
  listSeparator: {height: 1, backgroundColor: 'lightgrey'},
  buttonContainer: {
    marginTop: 24,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    padding: 24,
  },
  emptyText: {
    fontSize: 18,
    color: 'darkslategrey',
  },
  amountText: {
    marginTop: 24,
    color: 'darkslategrey',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
