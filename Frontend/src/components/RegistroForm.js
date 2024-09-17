import React, { useState } from 'react';
import { TextField, Button, Container, Box, Typography, CircularProgress } from '@mui/material';

const RegistroForm = () => {
  const [formData, setFormData] = useState({
    ruc_dni: '',
    nombre_completo: '',
    correo_contacto: '',
    telefono_contacto: '',
    empresa: ''
  });

  const [loading, setLoading] = useState(false);  // Para manejar el estado de carga
  const [error, setError] = useState('');         // Para manejar errores de la API

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Función para consultar la API de RUC o DNI
  const handleConsultar = async () => {
    const { ruc_dni } = formData;

    // Determinar si es DNI (8 dígitos) o RUC (11 dígitos)
    const isRUC = ruc_dni.length === 11;
    const isDNI = ruc_dni.length === 8;

    if (!isRUC && !isDNI) {
      setError('El RUC debe tener 11 dígitos o el DNI debe tener 8 dígitos');
      return;
    }

    setLoading(true);  // Bloquear el formulario
    setError('');      // Limpiar errores previos

    const url = isRUC 
      ? `https://apiperu.dev/api/ruc`
      : `https://apiperu.dev/api/dni`;

    const body = isRUC
      ? { ruc: ruc_dni }
      : { dni: ruc_dni };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer 727eb76e677982d373a90531bc86502d542cff22a4f973fcd08594d1b27ede85`,  // Usa el token que te pase
        },
        body: JSON.stringify(body),  // Enviar el DNI o RUC en el cuerpo
      });

      if (!response.ok) {
        throw new Error('Error al consultar la API');
      }

      const data = await response.json();

      if (isRUC) {
        // Actualizar el formulario con los datos de la empresa (para RUC)
        setFormData({
          ...formData,
          nombre_completo: data.data.nombre_o_razon_social || '',
          empresa: data.data.nombre_o_razon_social || '',
        });
      } else {
        // Actualizar el formulario con los datos del DNI
        setFormData({
          ...formData,
          nombre_completo: `${data.data.nombre_completo}`,
        });
      }

    } catch (error) {
      setError('Error al consultar la API');
    } finally {
      setLoading(false);  // Desbloquear el formulario
    }
  };

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Enviar los datos al backend
    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Usuario registrado y correo enviado');
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error al enviar los datos:', error);
    }
  };

  return (
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
     
      <Box sx={{ mb: 2 }}>
        <div ></div>
      </Box>

      
      

      {/* Formulario */}
      <Box
        component="form"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          marginTop:'25px',
          gap: 2,
          bgcolor: 'white',
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
        }}
        onSubmit={handleSubmit}
      >
        {/* RUC / DNI con botón de consulta */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            label="RUC / DNI"
            variant="outlined"
            name="ruc_dni"
            value={formData.ruc_dni}
            onChange={handleChange}
            required
            fullWidth
            disabled={loading}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleConsultar}
            disabled={loading || formData.ruc_dni.length < 8} // Deshabilitado si es menor a 8 caracteres
          >
            {loading ? <CircularProgress size={24} /> : 'Consultar'}
          </Button>
        </Box>

        {error && <Typography color="error">{error}</Typography>}

        <TextField
          label="Nombre Completo"
          variant="outlined"
          name="nombre_completo"
          value={formData.nombre_completo}
          onChange={handleChange}
          required
          fullWidth
          disabled={loading}
        />
        <TextField
          label="Correo de Contacto"
          variant="outlined"
          name="correo_contacto"
          value={formData.correo_contacto}
          onChange={handleChange}
          required
          fullWidth
          type="email"
          disabled={loading}
        />
        <TextField
          label="Teléfono de Contacto"
          variant="outlined"
          name="telefono_contacto"
          value={formData.telefono_contacto}
          onChange={handleChange}
          required
          fullWidth
          disabled={loading}
        />
        <TextField
          label="Empresa"
          variant="outlined"
          name="empresa"
          value={formData.empresa}
          onChange={handleChange}
          required
          fullWidth
          disabled={loading || formData.ruc_dni.length === 8} // Deshabilitar empresa si es DNI
        />

        {/* Botón de envío */}
        <Button variant="contained" color="primary" fullWidth type="submit" disabled={loading}>
          Registrar
        </Button>
      </Box>
    </Container>
  );
};

export default RegistroForm;
