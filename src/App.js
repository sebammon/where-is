import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, HStack, Text, useColorModeValue } from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { AddIcon } from '@chakra-ui/icons';
import CreatePost from './components/CreatePost';
import { FirebaseContext } from './contexts';
import Posts from './components/Posts';
import Login from './components/Login';

function App() {
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const firebase = useContext(FirebaseContext);

  useEffect(() => {
    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = firebase.subscribeToPosts(posts => setPosts(posts.map(post => {
      return ({
        ...post,
        images: (post.images || []).map((imagePath) => firebase.getImageUrl(imagePath)),
      });
    })));

    return unsubscribe;
  }, [firebase]);

  useEffect(() => {
    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = firebase.onAuthChange(user => setUser(user));

    return unsubscribe;
  }, [firebase]);

  const handleLogin = async ({ email, password }) => {
    try {
      await firebase.signIn(email, password);
      setShowLogin(false);
    } catch (e) {
      window.alert(e.message);
      setUser(null);
    }
  };

  const handleCreatePost = async ({ images, location, caption }) => {
    setIsLoading(true);
    try {
      const imagePaths = await firebase.uploadFiles(images);
      await firebase.addPost({ location, caption, images: imagePaths });
    } catch (e) {
      window.alert(`An error occurred while creating the post: ${e.code}`);
    }
    setIsLoading(false);
    setShowCreate(false);
  };

  return (
    <Box minH={'100vh'}>
      <Box as={'header'} p={2} bgColor={useColorModeValue('gray.200', 'gray.600')}>
        <Box maxW={'8xl'} px={2} mx={'auto'}>
          <HStack>
            <Text fontSize={'xl'} flexGrow={1}>
              WHERE IS...?
            </Text>
            <Box>
              {user
                ? <Button leftIcon={<AddIcon />} onClick={() => setShowCreate(true)} mr={2}>
                  Post
                </Button>
                : <Button onClick={() => setShowLogin(true)} mr={2}>
                  Login
                </Button>
              }
              {user &&
                <Button onClick={() => firebase.signOut()} mr={2}>
                  Logout
                </Button>
              }
              <ColorModeSwitcher />
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box as={'main'} maxW={'4xl'} mx={'auto'} mt={4} px={4} mb={4}>
        {showLogin
          ? <Login onSubmit={handleLogin} onCancel={() => setShowLogin(false)} />
          : showCreate
            ? <CreatePost loading={isLoading} onCancel={() => setShowCreate(false)} onSubmit={handleCreatePost} />
            : <Posts posts={posts} />
        }
      </Box>
    </Box>
  );
}

export default App;