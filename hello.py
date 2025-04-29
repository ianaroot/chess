import math

class Container:
    """
    A container of integers that should support
    addition, removal, and search for the median integer
    """
    def __init__(self):
        self.container = []
        pass

    def add(self, value: int) -> None:
        self.container.append(value)
        """
        Adds the specified value to the container

        :param value: int
        """
        # TODO: implement this method
        pass

    def delete(self, value: int) -> bool:
        if self.container.count(value) != 0:
            self.container.remove(value)
            return True
        else:
            return False
                
        """
        Attempts to delete one item of the specified value from the container

        :param value: int
        :return: True, if the value has been deleted, or
                 False, otherwise.
        """
        # TODO: implement this method

    def get_median(self) -> int:
        sorted_container = self.container.copy()
        sorted_container.sort()
        length = len(self.container)
        if length % 2 == 0:
            modifier = 1
        else:
            modifier = 0
        midpoint = math.floor(length/2) - modifier
        median = sorted_container[midpoint]
        return median
        """
        Finds the container's median integer value, which is
        the middle integer when the all integers are sorted in order.
        If the sorted array has an even length,
        the leftmost integer between the two middle 
        integers should be considered as the median.

        :return: The median if the array is not empty, or
        :raise:  a runtime exception, otherwise.
        """
        # TODO: implement this method



taint = Container()
taint.add(1)
taint.add(3)
taint.add(2)
print(taint.container)
print('median')
median = taint.get_median()
print(median)


taint.delete(2)
taint.delete(2)
print(taint.container)

print('median')
median = taint.get_median()
print(median)

print('test')
print([1,2,3])
print([1,3,2][1])