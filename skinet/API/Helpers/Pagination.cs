namespace API.Helpers
{
    public class Pagination<T> where T:class
    {
        public Pagination(int _PageIndex,int _PageSize,int _Count,IReadOnlyList<T> _Data)
        {
            PageIndex = _PageIndex;
            PageSize = _PageSize;
            Count = _Count;
            Data = _Data;
        }

        public int PageIndex { get; set; } 

        public int PageSize { get; set; } 

        public int Count { get; set; } 

        public IReadOnlyList<T> Data { get; set; } 


    }
}