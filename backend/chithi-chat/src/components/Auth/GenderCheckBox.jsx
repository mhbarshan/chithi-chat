/* eslint-disable react/prop-types */
import { Checkbox, Stack } from "@chakra-ui/react";

const GenderCheckBox = ({ onCheckBoxChange, selectedGender }) => {
  return (
    <Stack spacing={5} direction="row">
      <Checkbox
        colorScheme="green"
        isChecked={selectedGender === "male"}
        onChange={() => onCheckBoxChange("male")}
        id="male"
      >
        Male
      </Checkbox>
      <Checkbox
        id="female"
        colorScheme="green"
        isChecked={selectedGender === "female"}
        onChange={() => onCheckBoxChange("female")}
      >
        Female
      </Checkbox>
      <Checkbox
        colorScheme="green"
        isChecked={selectedGender === "others"}
        onChange={() => onCheckBoxChange("others")}
        id="others"
      >
        Others
      </Checkbox>
    </Stack>
  );
};

export default GenderCheckBox;
