import React, { createContext, useContext, useState } from 'react';

type ImageContextType = {
  imageUri: string | null;
  setImageUri: (uri: string | null) => void;
};

const ImageContext = createContext<ImageContextType>({
  imageUri: null,
  setImageUri: () => {},
});

export const ImageProvider = ({ children }: { children: React.ReactNode }) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  return (
    <ImageContext.Provider value={{ imageUri, setImageUri }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImage = () => useContext(ImageContext);
