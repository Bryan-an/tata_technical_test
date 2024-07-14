import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Formik} from 'formik';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {HomeStackParamList} from '../navigation';
import {FilledButtonComponent, OutlinedButtonComponent} from '../components';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as Yup from 'yup';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {productService} from '@/services/index';

interface Props extends NativeStackScreenProps<HomeStackParamList, 'Form'> {}

const validationSchema = Yup.object().shape({
  ID: Yup.string()
    .required('Este campo es obligatorio')
    .min(3, 'Mínimo 3 caracteres')
    .max(10, 'Máximo 10 caracteres'),
  name: Yup.string()
    .required('Este campo es obligatorio')
    .min(5, 'Mínimo 5 caracteres')
    .max(100, 'Máximo 100 caracteres'),
  description: Yup.string()
    .required('Este campo es obligatorio')
    .min(10, 'Mínimo 10 caracteres')
    .max(500, 'Máximo 200 caracteres'),
  logo: Yup.string().required('Este campo es obligatorio'),
  date_release: Yup.date()
    .required('Este campo es obligatorio')
    .min(
      new Date(),
      'La fecha de liberación debe ser mayor o igual a la fecha actual',
    ),
  date_revision: Yup.date()
    .required('Este campo es obligatorio')
    .when(['$date_release'], ([date_release], schema) =>
      schema.min(
        new Date(
          new Date(
            new Date(date_release).setFullYear(date_release.getFullYear() + 1),
          ).setHours(0, 0, 0, 0),
        ),
        'La fecha de revisión debe ser exactamente un año posterior a la fecha de liberación',
      ),
    ),
});

export const FormScreen: React.FC<Props> = ({navigation, route}) => {
  const [isReleaseDatePickerOpen, setIsReleaseDatePickerOpen] =
    useState<boolean>(false);

  const [isRevisionDatePickerOpen, setIsRevisionDatePickerOpen] =
    useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(!!route.params?.id);

  const [initialValues, setInitialValues] = useState<{
    ID: string;
    name: string;
    description: string;
    logo: string;
    date_release: Date;
    date_revision: Date;
  }>({
    ID: '',
    name: '',
    description: '',
    logo: '',
    date_release: new Date(),
    date_revision: new Date(
      new Date().setFullYear(new Date().getFullYear() + 1),
    ),
  });

  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (route.params?.id) {
      productService
        .getOne(route.params.id)
        .then(({data}) => {
          setInitialValues({
            ID: data.id,
            name: data.name,
            description: data.description,
            logo: data.logo,
            date_release: new Date(data.date_release),
            date_revision: new Date(data.date_revision),
          });
        })
        .catch(error => {
          Alert.alert(
            'Error',
            error.message ?? 'Ocurrió un error al obtener el producto',
          );
        })
        .finally(() => setIsLoading(false));
    }
  }, []);

  return isLoading ? (
    <View style={styles.spinnerContainer}>
      <ActivityIndicator size="large" color="gold" />
    </View>
  ) : (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={{paddingBottom: insets.bottom}}>
      <Text style={styles.title}>Formulario de Registro</Text>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values, actions) => {
          if (route.params?.id) {
            productService
              .update(route.params.id, {
                name: values.name,
                description: values.description,
                logo: values.logo,
                date_release: values.date_release.toISOString(),
                date_revision: values.date_revision.toISOString(),
              })
              .then(({data}) => {
                Alert.alert(
                  'Éxito',
                  data.message ?? 'Producto actualizado exitosamente',
                );

                navigation.pop();
                navigation.replace('Details', {id: route.params!.id});
              })
              .catch(error => {
                Alert.alert(
                  'Error',
                  error.message ?? 'Ocurrió un error al actualizar el producto',
                );
              })
              .finally(() => actions.setSubmitting(false));

            return;
          }

          productService
            .create({
              id: values.ID,
              name: values.name,
              description: values.description,
              logo: values.logo,
              date_release: values.date_release.toISOString(),
              date_revision: values.date_revision.toISOString(),
            })
            .then(({data}) => {
              Alert.alert(
                'Éxito',
                data.message ?? 'Producto registrado exitosamente',
              );

              navigation.popToTop();
              navigation.replace('Home');
            })
            .catch(error => {
              Alert.alert(
                'Error',
                error.message ?? 'Ocurrió un error al registrar el producto',
              );
            })
            .finally(() => actions.setSubmitting(false));
        }}>
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          resetForm,
          setFieldValue,
          values,
          errors,
          touched,
          isSubmitting,
        }) => (
          <>
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>ID</Text>
                <TextInput
                  onChangeText={handleChange('ID')}
                  value={values.ID}
                  onBlur={handleBlur('ID')}
                  style={[
                    styles.input,
                    errors.ID && touched.ID
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}
                  placeholder="123ABC"
                  editable={!route.params?.id}
                />
                {errors.ID && touched.ID ? (
                  <Text style={styles.error}>{errors.ID}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  onChangeText={handleChange('name')}
                  value={values.name}
                  onBlur={handleBlur('name')}
                  style={[
                    styles.input,
                    errors.name && touched.name
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}
                  placeholder="123ABC"
                />
                {errors.name && touched.name ? (
                  <Text style={styles.error}>{errors.name}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Descripción</Text>
                <TextInput
                  onChangeText={handleChange('description')}
                  value={values.description}
                  onBlur={handleBlur('description')}
                  style={[
                    styles.input,
                    errors.description && touched.description
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}
                  placeholder="123ABC"
                />
                {errors.description && touched.description ? (
                  <Text style={styles.error}>{errors.description}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Logo</Text>
                <TextInput
                  onChangeText={handleChange('logo')}
                  value={values.logo}
                  onBlur={handleBlur('logo')}
                  style={[
                    styles.input,
                    errors.logo && touched.logo
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}
                  placeholder="123ABC"
                />
                {errors.logo && touched.logo ? (
                  <Text style={styles.error}>{errors.logo}</Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fecha de Liberación</Text>
                <TouchableOpacity
                  onPress={() => setIsReleaseDatePickerOpen(true)}
                  style={[
                    styles.input,
                    errors.date_release && touched.date_release
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}>
                  {values.date_release ? (
                    <Text>{values.date_release?.toDateString()}</Text>
                  ) : (
                    <Text style={styles.placeholder}>Seleccionar fecha</Text>
                  )}
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={isReleaseDatePickerOpen}
                  mode="date"
                  minimumDate={new Date(new Date().setHours(0, 0, 0, 0))}
                  date={values.date_release}
                  onConfirm={date => {
                    setIsReleaseDatePickerOpen(false);

                    setFieldValue(
                      'date_release',
                      new Date(date.setHours(0, 0, 0, 0)),
                    );
                  }}
                  onCancel={() => setIsReleaseDatePickerOpen(false)}
                />
                {errors.date_release && touched.date_release ? (
                  <Text style={styles.error}>
                    {typeof errors.date_release === 'string'
                      ? errors.date_release
                      : 'Campo inválido'}
                  </Text>
                ) : null}
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Fecha de Liberación</Text>
                <TouchableOpacity
                  onPress={() => setIsRevisionDatePickerOpen(true)}
                  style={[
                    styles.input,
                    errors.date_revision && touched.date_revision
                      ? {borderColor: 'orangered'}
                      : undefined,
                  ]}>
                  {values.date_revision ? (
                    <Text>{values.date_revision?.toDateString()}</Text>
                  ) : (
                    <Text style={styles.placeholder}>Seleccionar fecha</Text>
                  )}
                </TouchableOpacity>
                <DatePicker
                  modal
                  open={isRevisionDatePickerOpen}
                  mode="date"
                  minimumDate={
                    new Date(
                      new Date(
                        new Date(values.date_release).setFullYear(
                          values.date_release.getFullYear() + 1,
                        ),
                      ).setHours(0, 0, 0, 0),
                    )
                  }
                  date={values.date_revision}
                  onConfirm={date => {
                    setIsRevisionDatePickerOpen(false);

                    setFieldValue(
                      'date_revision',
                      new Date(date.setHours(0, 0, 0, 0)),
                    );
                  }}
                  onCancel={() => setIsRevisionDatePickerOpen(false)}
                />
                {errors.date_revision && touched.date_revision ? (
                  <Text style={styles.error}>
                    {typeof errors.date_revision === 'string'
                      ? errors.date_revision
                      : 'Campo inválido'}
                  </Text>
                ) : null}
              </View>
            </View>

            <View style={styles.buttonsContainer}>
              <FilledButtonComponent
                text={route.params?.id ? 'Actualizar' : 'Registrar'}
                onPress={() => handleSubmit()}
                isLoading={isSubmitting}>
                <Icon name="save" size={18} color="darkslategrey" />
              </FilledButtonComponent>

              <OutlinedButtonComponent
                text="Resetear Formulario"
                onPress={() => resetForm()}>
                <Icon name="refresh" size={18} color="darkslategrey" />
              </OutlinedButtonComponent>
            </View>
          </>
        )}
      </Formik>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    padding: 22,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'darkslategrey',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 24,
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    color: 'darkslategrey',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: 'darkslategrey',
    borderRadius: 8,
    padding: 8,
    marginTop: 8,
  },
  error: {
    color: 'orangered',
    fontSize: 14,
    marginTop: 4,
  },
  buttonsContainer: {
    marginTop: 16,
    gap: 12,
  },
  placeholder: {
    color: 'lightgrey',
  },
  spinnerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
