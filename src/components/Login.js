import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input, Text, VStack } from '@chakra-ui/react';

function Login({ loading, onCancel, onSubmit }) {
  const [data, setData] = useState({});

  const handleChange = e => {
    setData({ ...data, [e.target.id]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} onChange={handleChange} onReset={onCancel}>
        <VStack spacing={4} alignItems={'flex-start'}>
          <Text fontSize={'3xl'}>Login</Text>
          <FormControl isRequired={true}>
            <FormLabel htmlFor='email'>Email</FormLabel>
            <Input id='email' type='email' required={true} />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel htmlFor='password'>Password</FormLabel>
            <Input id='password' type='password' required={true} />
          </FormControl>
          <HStack alignSelf={'flex-end'}>
            <Button isLoading={loading} disabled={loading} type={'submit'}>Login</Button>
            <Button type={'reset'} variant={'outline'}>Cancel</Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}

export default Login;
