import React, { useState } from 'react';
import { Box, Button, FormControl, FormLabel, HStack, Input, Text, Textarea, VStack } from '@chakra-ui/react';

function CreatePost({ loading, onCancel, onSubmit }) {
  const [data, setData] = useState({});

  const handleChange = e => {
    setData({ ...data, [e.target.id]: e.target.files || e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit && onSubmit(data);
  };

  return (
    <Box>
      <form onSubmit={handleSubmit} onChange={handleChange} onReset={onCancel}>
        <VStack spacing={4} alignItems={'flex-start'}>
          <Text fontSize={'3xl'}>New post</Text>
          <FormControl isRequired={true}>
            <FormLabel htmlFor='images'>Images</FormLabel>
            <input id={'images'} type={'file'} multiple={true} accept={'image/*'} required={true} />
          </FormControl>
          <FormControl>
            <FormLabel htmlFor='location'>Location</FormLabel>
            <Input id='location' type='input' required={false} />
          </FormControl>
          <FormControl isRequired={true}>
            <FormLabel htmlFor='caption'>Caption</FormLabel>
            <Textarea id='caption' required={true} />
          </FormControl>
          <HStack alignSelf={'flex-end'}>
            <Button isLoading={loading} disabled={loading} type={'submit'}>Create</Button>
            <Button type={'reset'} variant={'outline'}>Cancel</Button>
          </HStack>
        </VStack>
      </form>
    </Box>
  );
}

export default CreatePost;
