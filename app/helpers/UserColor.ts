export const userColor = (color: string, opacity = 1) => {
    switch (color) {
      case 'bg-pastel-black':
        return `rgba(211, 211, 211, ${opacity})`;
      case 'bg-pastel-red':
        return `rgba(255, 153, 153, ${opacity})`;
      case 'bg-pastel-brown':
        return `rgba(255, 204, 204, ${opacity})`;
      case 'bg-pastel-orange':
        return `rgba(255, 218, 185, ${opacity})`;
      case 'bg-pastel-indigo':
        return `rgba(153, 204, 255, ${opacity})`;
      case 'bg-pastel-blue':
        return `rgba(218, 240, 247, ${opacity})`;
      case 'bg-pastel-green':
        return `rgba(178, 223, 219, ${opacity})`;
      case 'bg-pastel-emerald':
        return `rgba(204, 255, 204, ${opacity})`;
      case 'bg-pastel-purple':
        return `rgba(204, 204, 255, ${opacity})`;
      default:
        return `rgba(255, 255, 204, ${opacity})`;
    }
  };