import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Aerostack } from '@aerostack/react-native';

/**
 * React Native Basic Auth
 * 
 * Demonstrates a simple Login Screen using the React Native SDK.
 */

// Initialize SDK
const sdk = new Aerostack({
    // baseURL: 'https://api.aerostack.ai/v1' // Optional
});

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [userInfo, setUserInfo] = useState<any>(null);

    const handleLogin = async () => {
        setLoading(true);
        try {
            console.log('Logging in...');
            const res = await sdk.authentication.authSignin({
                email,
                password
            });

            if (res.ok) {
                setUserInfo(res.value.user);
                // In a real app, save res.value.token to SecureStore provided by Expo or similar
            } else {
                alert('Login Failed: ' + JSON.stringify(res.error));
            }
        } catch (error: any) {
            alert('Error: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    if (userInfo) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Welcome, {userInfo.name}</Text>
                <Button title="Logout" onPress={() => setUserInfo(null)} />
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Aerostack Login</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
            />

            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />

            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Login" onPress={handleLogin} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginBottom: 15,
        borderRadius: 5,
    },
});
