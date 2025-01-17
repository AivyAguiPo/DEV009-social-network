import * as authentication from 'firebase/auth';
import register from '../src/components/register.js';

// Mock de createUserWithEmailAndPassword
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
}));
jest.mock('firebase/firestore', () => ({
  getFirestore: jest.fn(),
  setDoc: jest.fn(),
  doc: jest.fn(),
}));
describe('register', () => {
  const navigateTo = jest.fn();
  beforeEach(() => {
    // Configurar el DOM y los elementos necesarios antes de cada prueba
    document.body.innerHTML = ''; // Limpiar el contenido del body antes de cada prueba
    document.body.append(register(navigateTo));
  });

  it('Redirecciona a Home una vez que el usuario ha sido creado', async () => {
    jest.spyOn(authentication, 'createUserWithEmailAndPassword').mockResolvedValue({
      user: {
        uid: 'user-uid',
        email: 'example@example.com',
      },
    });
    const name = document.getElementById('name');
    const lastName = document.getElementById('userLastName');
    const email = document.getElementById('userEmailRegister');
    const pass = document.getElementById('userPasswordRegister');
    const birthDate = document.getElementById('userBirthDate');
    const btn = document.getElementById('btnRegister');
    name.value = 'prueba';
    lastName.value = 'apellido';
    birthDate.value = '2000-01-01';
    email.value = 'correo-valido@correo.com';
    pass.value = 'password123';
    btn.click();

    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(navigateTo).toHaveBeenCalledWith('/home');
  });
  it('Arroja un mensaje que nos indica que los campos estan vacios', () => {
    const btn = document.getElementById('btnRegister');
    btn.click();
    const message = document.getElementById('errorMessage');
    expect(message.textContent).toBe('Por favor llena todos los campos');
  });

  it('Arroja un mensaje que solicita un correo electrónico con el formato correcto', () => {
    const name = document.getElementById('name');
    const lastName = document.getElementById('userLastName');
    const email = document.getElementById('userEmailRegister');
    const pass = document.getElementById('userPasswordRegister');
    const birthDate = document.getElementById('userBirthDate');
    const btn = document.getElementById('btnRegister');
    name.value = 'prueba';
    lastName.value = 'apellido';
    birthDate.value = '2000-01-01';
    email.value = 'correo-invalido';
    pass.value = '1234567890';
    btn.click();
    const message = document.getElementById('errorMessage');
    expect(message.textContent).toBe('Por favor, ingresa un correo electrónico válido.');
  });

  it('Arroja un mensaje que solicita un password de mínimo 8 digitos', () => {
    const name = document.getElementById('name');
    const lastName = document.getElementById('userLastName');
    const email = document.getElementById('userEmailRegister');
    const pass = document.getElementById('userPasswordRegister');
    const birthDate = document.getElementById('userBirthDate');
    const btn = document.getElementById('btnRegister');
    name.value = 'prueba';
    lastName.value = 'apellido';
    birthDate.value = '2000-01-01';
    email.value = 'correo-valido@correo.com';
    pass.value = '1234';
    btn.click();
    const message = document.getElementById('errorMessage');
    expect(message.textContent).toBe('Introduce una contraseña con 8 o más caracteres');
  });
  it('Arroja un mensaje que notifica que el usuario ya se encuentra registrado', async () => {
    jest.spyOn(authentication, 'createUserWithEmailAndPassword').mockRejectedValue(new Error('Firebase: Error (auth/email-already-in-use).'));
    const name = document.getElementById('name');
    const lastName = document.getElementById('userLastName');
    const email = document.getElementById('userEmailRegister');
    const pass = document.getElementById('userPasswordRegister');
    const birthDate = document.getElementById('userBirthDate');
    const btn = document.getElementById('btnRegister');
    name.value = 'prueba';
    lastName.value = 'apellido';
    birthDate.value = '2000-01-01';
    email.value = 'correo-valido@correo.com';
    pass.value = 'password123';
    btn.click();
    const message = document.getElementById('errorMessage');
    // eslint-disable-next-line no-promise-executor-return
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(message.textContent).toBe('Este correo ya se encuentra registrado');
  });
});
