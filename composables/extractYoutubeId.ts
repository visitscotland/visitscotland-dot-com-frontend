const extractYoutubeId = (input: string): string => input.replace('https://www.youtube.com/watch?v=', '');

export default extractYoutubeId;
