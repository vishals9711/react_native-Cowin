import React, { useEffect, useState } from 'react';
import { Button, Card } from 'react-native-elements';
import { AGE_LIMITS } from '../../constants/ageLimit';
import { STATES } from '../../constants/states';
import { CENTER_RESPONSE } from '../../models/centerResponse';
import { DISTRICT } from '../../models/districts';
import { getAvailableSlots } from '../../services/getAvailableSlots';
import { getDistrictByState } from '../../services/getDistricts';
import ModalDropdown from 'react-native-modal-dropdown';
import { StyleSheet, Text, View } from 'react-native';
import { API_BASE } from '../../constants/paths';

interface onChange {
  target: {
    value: string;
  };
}

function CardComponent(): React.ReactElement {
  const [currentState, setCurrentState] = useState<number | null>(null);
  const [districts, setDistricts] = useState<Array<DISTRICT> | null>(null);
  const [currentDistrict, setCurrentDistrict] = useState<number | null>(null);
  const [ageCategory, setAgeCategory] = useState<number | null>(null);
  const [timer, setTimer] = useState<Array<NodeJS.Timer>>([]);
  useEffect(() => {
    if (currentState) {
      setDistricts(null);
      console.log(currentState);
      const url = API_BASE + `/v2/admin/location/districts/${currentState}`;
      fetch('https://examples.com/data.json')
        .then((response) => response.json())
        .then(data => console.log(data))
        .catch((error) => {
          console.error(error);
        });
      // getDistrictByState(currentState).then(data=>{
      //   console.log(data);
      // })
    }
  }, [currentState]);

  const getSlots = () => {
    timer.forEach(time => clearInterval(time));
    setTimer([]);
    if (currentDistrict && ageCategory) {
      const interval = setInterval(() => {
        getAvailableSlots(currentDistrict).then((data) => {
          const centerWithSessions = getIfSlotExists(data.data, ageCategory);
          if (centerWithSessions && centerWithSessions.length) clearInterval(interval);
        });
      }, 1000);
      setTimer([...timer, interval]);
    }
  }

  const getIfSlotExists = (data: CENTER_RESPONSE, age: number) => {
    const centerWithSessions = data.centers?.map(center => {
      const sessions = center.sessions?.filter(session => session.available_capacity && session.available_capacity > 0 && age >= session.min_age_limit);
      if (sessions?.length)
        return {
          ...center,
          sessions: sessions
        }
    }).filter(center => center);
    return centerWithSessions;
  }

  return (
    <Card>
      <ModalDropdown options={AGE_LIMITS} showsVerticalScrollIndicator onSelect={(index: number, value: {
        id: number;
        label: string;
      }) => setAgeCategory(value.id)} renderRow={(item: {
        id: number;
        label: string;
      }) => <><Text>{item.label}</Text></>} renderButtonText={(item: {
        id: number;
        label: string;
      }) => <><Text>{item.label}</Text></>} defaultValue={"Select Age Category"} />


      <ModalDropdown options={STATES.states} showsVerticalScrollIndicator onSelect={(index: number, value: {
        state_id: number;
        state_name: string;
      }) => setCurrentState(value.state_id)} renderRow={(item: {
        state_id: number;
        state_name: string;
      }) => <><Text>{item.state_name}</Text></>} renderButtonText={(item: {
        state_id: number;
        state_name: string;
      }) => <><Text>{item.state_name}</Text></>} defaultValue={"Select State"} />


      {districts && (<ModalDropdown options={districts} showsVerticalScrollIndicator onSelect={(index: number, value: {
        state_id: number;
        district_id: number;
        district_name: string;
        district_name_l: string;
      }
      ) => setCurrentDistrict(value.district_id)} renderRow={(item: {
        state_id: number;
        district_id: number;
        district_name: string;
        district_name_l: string;
      }
      ) => <><Text>{item.district_name || item.district_name_l}</Text></>} renderButtonText={(item: {
        state_id: number;
        district_id: number;
        district_name: string;
        district_name_l: string;
      }
      ) => <><Text>{item.district_name || item.district_name_l}</Text></>} defaultValue={"Select District"} />)}

      {!districts && (<ModalDropdown options={[]} disabled defaultValue={"Select District"} />)}
      {/* <Picker
        placeholder="Select Age Category"
        items={AGE_LIMITS}
        containerStyle={{ height: 40 }}
        onChangeItem={(item: { id: number }) => setAgeCategory(item.id)}
      ></Picker>
      <DropDownPicker
        placeholder="Select State"
        items={STATES.states}
        containerStyle={{ height: 40 }}
        onChangeItem={(item: { id: number }) => setAgeCategory(item.id)}
      />
      {districts && (
        <DropDownPicker
          placeholder="Select District"
          items={districts}
          containerStyle={{ height: 40 }}
          onChangeItem={(item: { id: number }) => setAgeCategory(item.id)}
        />
      )}
      {!districts && <DropDownPicker
        disabled
      />}
      */}
      <Button
        disabled={!(currentState && currentDistrict && ageCategory)}
        onPress={getSlots}
        raised
        title={"Create Alert"}
      />
    </Card>
  );
}

export default CardComponent;
