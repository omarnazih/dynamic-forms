export const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1).replace(/_/g, ' ');
};

export const formatName = (name: string): string => {
    return name.split('_').map(capitalizeFirstLetter).join(' ');
}; 