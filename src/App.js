import React, { useContext, useEffect, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { ColorModeSwitcher } from './components/ColorModeSwitcher';
import { AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import CreatePost from './components/CreatePost';
import { FirebaseContext } from './contexts';
import Posts from './components/Posts';
import Login from './components/Login';
import Compressor from 'compressorjs';

const resizeImages = (image) =>
  new Promise((resolve, reject) => {
    if (!image) {
      resolve();
      return;
    }

    new Compressor(image, {
      quality: 0.6,
      success(file) {
        const parts = file.name.split('.');

        resolve(
          new File([file], `${crypto.randomUUID()}.${parts.at(-1)}`, {
            type: file.type,
          })
        );
      },
      error(error) {
        reject(error);
      },
    });
  });

function App() {
  const [posts, setPosts] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const firebase = useContext(FirebaseContext);

  const variant = useBreakpointValue({ base: 'mobile', md: 'desktop' });

  useEffect(() => {
    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = firebase.subscribeToPosts((posts) =>
      setPosts(
        posts.map((post) => ({
          ...post,
          images: (post.images || []).map((imagePath) =>
            firebase.getImageUrl(imagePath)
          ),
        }))
      )
    );

    return unsubscribe;
  }, [firebase]);

  useEffect(() => {
    // noinspection UnnecessaryLocalVariableJS
    const unsubscribe = firebase.onAuthChange((user) => setUser(user));

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
      const resized = await Promise.all([...images].map(resizeImages));

      const imagePaths = await firebase.uploadFiles(resized);
      await firebase.addPost({ location, caption, images: imagePaths });
    } catch (e) {
      window.alert(`An error occurred while creating the post: ${e.message}`);
    }
    setIsLoading(false);
    // setShowCreate(false);
  };

  return (
    <Box minH={'100vh'}>
      <Box
        as={'header'}
        p={2}
        bgColor={useColorModeValue('gray.200', 'gray.600')}
      >
        <Box maxW={'8xl'} px={2} mx={'auto'}>
          <HStack>
            <Text className={'title'} fontSize={'2xl'} flexGrow={1}>
              WHERE IS...?
            </Text>
            <Box>
              {variant === 'mobile' ? (
                <Menu>
                  <MenuButton
                    as={IconButton}
                    aria-label="Options"
                    icon={<HamburgerIcon />}
                    variant="outline"
                    mr={2}
                  />
                  <MenuList>
                    {user ? (
                      <MenuItem
                        onClick={() => setShowCreate(true)}
                        icon={<AddIcon />}
                      >
                        Post
                      </MenuItem>
                    ) : (
                      <MenuItem onClick={() => setShowLogin(true)}>
                        Login
                      </MenuItem>
                    )}
                    {user && (
                      <MenuItem onClick={() => firebase.signOut()}>
                        Logout
                      </MenuItem>
                    )}
                  </MenuList>
                </Menu>
              ) : (
                <React.Fragment>
                  {user ? (
                    <Button
                      leftIcon={<AddIcon />}
                      onClick={() => setShowCreate(true)}
                      mr={2}
                    >
                      Post
                    </Button>
                  ) : (
                    <Button onClick={() => setShowLogin(true)} mr={2}>
                      Login
                    </Button>
                  )}
                  {user && (
                    <Button onClick={() => firebase.signOut()} mr={2}>
                      Logout
                    </Button>
                  )}
                </React.Fragment>
              )}
              <ColorModeSwitcher />
            </Box>
          </HStack>
        </Box>
      </Box>
      <Box as={'main'} maxW={'4xl'} mx={'auto'} mt={4} px={4} mb={4}>
        {showLogin ? (
          <Login onSubmit={handleLogin} onCancel={() => setShowLogin(false)} />
        ) : showCreate ? (
          <CreatePost
            loading={isLoading}
            onCancel={() => setShowCreate(false)}
            onSubmit={handleCreatePost}
          />
        ) : (
          <Posts posts={posts} />
        )}
      </Box>
    </Box>
  );
}

export default App;
